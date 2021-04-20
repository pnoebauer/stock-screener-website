const express = require('express');

const cors = require('cors');

const util = require('util');

const fetch = require('node-fetch');

const fetchData = require('./fetchData');

const constants = require('./constants');

//during testing or development
if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //load .env into process environment (adds variables from there)

const app = express(); //instantiate new express application
const PORT = 4000;

app.use(express.json()); //for any requests coming in, process their body tag and convert to json
app.use(express.urlencoded({extended: true})); //url requests that contain incorrect characters (i.e. spaces) are converted to correct ones
app.use(cors()); //allow requests from port 3000 (frontend) to port 5000 (backend)

let clients = [];
let facts = [];

app.listen(PORT, error => {
	if (error) throw error;
	console.log('Server running on port', PORT);
});

// repeat with the interval of 2 seconds
// let timerId = setInterval(() => console.log('tick'), 2000);
// let timerId = setInterval(
// 	// () => fetchData.fetchLiveData('SPY').then(data => console.log(data.SPY.lastPrice)),
// 	() => fetchData.fetchLiveData('SPY').then(data => console.log(data)),
// 	10000
// );

let cachedData = {};

// const symbols = ['SPY', 'GOOGL'];
const symbols = constants.SYMBOLS;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const splits = 5;
const interValTime = 60000;
let timerId = setInterval(
	// () => fetchData.fetchLiveData('SPY').then(data => console.log(data.SPY.lastPrice)),
	async () => {
		let startIndex = 0;
		let endIndex = symbols.length / splits;
		let data = {};
		// split fetches into 5 equal parts
		for (let i = 0; i < splits; i++) {
			let partialData = await fetchData.fetchLiveData(
				symbols.slice(startIndex, endIndex)
			);
			data = {...data, ...partialData};

			startIndex = endIndex;
			endIndex += symbols.length / splits;

			await sleep(interValTime / (splits + 2)); //make sure that all fetches are done before the next round
		}
		// let data = await fetchData.fetchLiveData(symbols);
		// // Object.keys(data).forEach(symbol => console.log(symbol, 'part1'));
		// // console.log('fetching...', data);
		// console.log('part1', Object.keys(data));

		// await sleep(15000);
		// let data2 = await fetchData.fetchLiveData(constants.SYMBOLS.slice(2, 4));
		// data = {...data, ...data2};
		// // console.log('------', data, 'concat-----');
		// console.log('part2', Object.keys(data));
		// // Object.keys(data).forEach(symbol => console.log(symbol, 'part2'));

		if (data.error) {
			console.log('error during fetching', data.error);
			return;
		}

		// console.log(data, 'data');

		// console.log('-----', data, '--------BEFORE');
		// /* METHOD 1 --> DESTRUCTURE TO REMOVE CERTAIN KEYS AND MAKE DEEP OBJECT COMPARISON */
		// /* APPEARS SLOWER THAN METHOD 2 */
		// console.time('time');
		// symbols.forEach(symbol => {
		// 	// console.log(data[symbol] !== undefined, symbol, 'qu---');
		// 	if (data[symbol] === undefined) console.log(symbol, 'qu---');
		// 	try {
		// 		// filter out below keys
		// 		let {
		// 			quoteTimeInLong,
		// 			tradeTimeInLong,
		// 			regularMarketTradeTimeInLong,
		// 			...filteredData
		// 		} = data[symbol];

		// 		data[symbol] = filteredData;
		// 	} catch (e) {
		// 		// console.log('no data for', symbol, Object.keys(data));
		// 		console.log('no data for', symbol);
		// 	}
		// });

		// console.log(util.isDeepStrictEqual(data, cachedData));

		// // after comparing with the prior data object, cache the current data object
		// cachedData = data;
		// // console.log(data, '--------AFTER');
		// console.timeEnd('time');

		/* METHOD 2 --> LOOP THROUGH OBJECTS AND COMPARE VALUES */
		/* APPEARS FASTER THAN METHOD 1 */
		console.time('time');

		let identical = true;

		for (const i in symbols) {
			const symbol = symbols[i];
			// console.log(symbol, 'symbol', data[symbol]);
			if (!data[symbol]) {
				console.log('fetching error for', symbol);
				data[symbol] = cachedData[symbol]; //if the new fetch request has no data for this symbol, then set it to the old one
				continue;
			}
			for (const key in data[symbol]) {
				// console.log(key, 'key');
				if (
					![
						'quoteTimeInLong',
						'tradeTimeInLong',
						'regularMarketTradeTimeInLong',
					].includes(key)
				) {
					if (cachedData[symbol]) {
						//if the new fetch request has no data for this symbol and key, then set it to the old one
						if (!data[symbol][key]) {
							data[symbol][key] = cachedData[symbol][key];
							continue;
						}
						if (data[symbol][key] !== cachedData[symbol][key]) {
							identical = false;
							break;
						}
					} else {
						identical = false;
						break;
					}
				}
			}

			if (!identical) break;
		}

		console.log(identical, 'identical');
		cachedData = data;
		console.timeEnd('time');
	},
	interValTime
);

// // after 5 seconds stop
// setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);

// util.isDeepStrictEqual(obj1, obj2) // true

// fetch(
// 	'https://api.tdameritrade.com/v1/marketdata/GOOGL/pricehistory?apikey=APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD&periodType=day&frequencyType=minute&frequency=1&endDate=1617271200000&startDate=1609495200000&needExtendedHoursData=true'
// )
// 	.then(res => res.json())
// 	.then(data => console.log(data));

function eventsHandler(req, res) {
	const headers = {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
	};
	res.writeHead(200, headers); //HTTP status set to 200 and headers object written to head

	//facts array is turned into a string
	const data = `data: ${JSON.stringify(facts)}\n\n`; // \n\n is mandatory to indicate the end of an event

	res.write(data);

	const clientId = Date.now();

	// create new client based on clientID and response
	const newClient = {
		id: clientId,
		res,
	};

	// console.log(newClient, 'newClient');

	// add this client to clients array
	clients.push(newClient);

	// when the client closes the connection that client will be filtered out from the clients array
	req.on('close', () => {
		console.log(`${clientId} Connection closed`);
		clients = clients.filter(client => client.id !== clientId);
	});
}

app.get('/events', eventsHandler);

// const eventType = 'test';

// sendEventsToAll iterates the clients array and uses the write method of each Express object to send the update.
function sendEventsToAll(newFact) {
	clients.forEach(client =>
		client.res.write(
			`event: data: ${JSON.stringify(newFact)}\n\n`
			// specify event type so that frontend can only listen to this type of event
			// // `event: ${eventType}\ndata: ${JSON.stringify(newFact)}\n\n`
		)
	);
}

// The addFact middleware saves the fact, returns it to the client which made POST request, and invokes the sendEventsToAll function.
async function addFact(req, res) {
	const newFact = req.body;
	facts.push(newFact);
	res.json(newFact);
	console.log('----------', facts, 'facts', newFact, 'newFact----------');
	return sendEventsToAll(newFact);
}

app.post('/fact', addFact);
