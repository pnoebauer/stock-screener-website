const express = require('express');

const cors = require('cors');

// const util = require('util');

// const fetch = require('node-fetch');

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
const symbolsPerSplit = Math.round(symbols.length / splits);

let timerId = setInterval(async () => {
	// console.log('new interval');

	let startIndex = 0;
	let endIndex = symbolsPerSplit;
	let data = {};
	// split fetches into 5 equal parts
	for (let i = 0; i < splits; i++) {
		let partialData = await fetchData.fetchLiveData(symbols.slice(startIndex, endIndex));
		data = {...data, ...partialData};

		// console.log('symbols', startIndex, 'to', endIndex, 'of', symbols.length);
		const d = new Date();
		// console.log(d.getMinutes(), d.getSeconds());

		startIndex = endIndex;
		endIndex += symbolsPerSplit;
		endIndex = Math.min(endIndex, symbols.length);

		if (i !== splits - 1) {
			// console.log('waiting', Math.round(interValTime / (splits + 2)), 'ms');
			await sleep(interValTime / (splits + 2)); //make sure that all fetches are done before the next round
		}
	}

	// console.log(data.AAPL.bidPrice, 'AAPL bid');
	// console.log(data.AAPL.askPrice, 'AAPL ask');

	if (data.error) {
		console.log('error during fetching', data.error);
		return;
	}

	// console.time('time');

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
				!['quoteTimeInLong', 'tradeTimeInLong', 'regularMarketTradeTimeInLong'].includes(
					key
				)
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
	if (!identical) {
		console.log(cachedData.AAPL);
		sendEventsToAll(data);
	}

	// console.timeEnd('time');
}, interValTime);

// // after 5 seconds stop
// setTimeout(() => {
// 	clearInterval(timerId);
// 	alert('stop');
// }, 5000);

function eventsHandler(req, res, id) {
	// console.log(id.split(','));

	const headers = {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
	};
	res.writeHead(200, headers); //HTTP status set to 200 and headers object written to head

	//data array is turned into a string
	// const data = `data: ${JSON.stringify(facts)}\n\n`; // \n\n is mandatory to indicate the end of an event
	// const data = `data: ${JSON.stringify(cachedData)}\n\n`;

	const requObj = {};
	id.split(',').forEach(symbol => (requObj[symbol] = cachedData[symbol]));

	const data = `data: ${JSON.stringify(requObj)}\n\n`;

	res.write(data);

	const clientId = Date.now();

	// create new client based on clientID and response
	const newClient = {
		id: clientId,
		res,
		symbol: id,
	};

	// console.log(newClient, 'newClient');
	console.log(clientId, 'clientId');

	// add this client to clients array
	clients.push(newClient);

	// when the client closes the connection that client will be filtered out from the clients array
	req.on('close', () => {
		console.log(`${clientId} Connection closed`);
		clients = clients.filter(client => client.id !== clientId);
		newClient.res.end();
		// if (!res.finished) {
		// 	res.end();
		// 	console.log("Stopped sending events.");
		//   }
	});
}

// app.get('/events', eventsHandler);
app.get('/events/:id', async function (req, res) {
	// Retrieve the tag from our URL path
	const id = req.query.id;
	// console.log(id);

	eventsHandler(req, res, id);
});

const eventType = 'test';
// sendEventsToAll iterates the clients array and uses the write method of each Express object to send the update.
function sendEventsToAll(data) {
	clients.forEach(client => {
		// console.log(client) ||
		// console.log(client.id);
		// const clientData = data[client.symbol];
		const clientData = {};
		client.symbol.split(',').forEach(symbol => (clientData[symbol] = cachedData[symbol]));

		// const data = `data: ${JSON.stringify(requObj)}\n\n`;
		client.res.write(
			// `data: ${JSON.stringify(data)}\n\n`
			`data: ${JSON.stringify(clientData)}\n\n`
			// specify event type so that frontend can only listen to this type of event
			// `event: ${eventType}\ndata: ${JSON.stringify(clientData)}\n\n`
		);
	});
}

// // The addFact middleware saves the fact, returns it to the client which made POST request, and invokes the sendEventsToAll function.
// async function addFact(req, res) {
// 	const newFact = req.body;
// 	facts.push(newFact);
// 	res.json(newFact);
// 	console.log('----------', facts, 'facts', newFact, 'newFact----------');
// 	return sendEventsToAll(newFact);
// }

// app.post('/fact', addFact);
