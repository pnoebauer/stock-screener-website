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

let cachedData = {};

const {SYMBOLS, API_TO_INDICATORS} = constants;

// fetchData.fetchLiveData(['SPY']).then(data => console.log(data));

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const filterData = dataSet => {
	let filteredData = {};

	for (const symbol in dataSet) {
		filteredData[symbol] = {};
		for (const key in dataSet[symbol]) {
			if (Object.keys(API_TO_INDICATORS).includes(key)) {
				// console.log(symbol, key, dataSet[symbol][key]);

				//removes trailing time (always 0:00)
				const keyValue =
					key === 'divDate' ? dataSet[symbol][key].split(' ')[0] : dataSet[symbol][key];

				filteredData[symbol][key] = keyValue;
			}
		}
	}

	return filteredData;
};

const splits = 5;
const interValTime = 60000;
const symbolsPerSplit = Math.round(SYMBOLS.length / splits);

const batchFetch = async symbolList => {
	let startIndex = 0;
	let endIndex = symbolsPerSplit;
	let data = {};
	// split fetches into 5 equal parts
	for (let i = 0; i < splits; i++) {
		let partialData = await fetchData.fetchLiveData(
			symbolList.slice(startIndex, endIndex)
		);

		let filteredData = filterData(partialData);
		// console.log(filteredData);

		data = {...data, ...filteredData};
		// console.log(data);

		// console.log('SYMBOLS', startIndex, 'to', endIndex, 'of', symbolList.length);
		// console.log(new Date().getMinutes(), new Date().getSeconds());

		startIndex = endIndex;
		endIndex += symbolsPerSplit;
		endIndex = Math.min(endIndex, symbolList.length);

		if (i !== splits - 1) {
			// console.log('waiting', Math.round(interValTime / (splits + 2)), 'ms');
			await sleep(interValTime / (splits + 2)); //make sure that all fetches are done before the next round
		}
	}
	// console.log(data.AAPL.bidPrice, 'AAPL bid');

	return data;
};

const compareCacheWithFetch = data => {
	let identical = true;

	for (const i in SYMBOLS) {
		const symbol = SYMBOLS[i];
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

	return identical;
};

// batchFetch(SYMBOLS.slice(0, 5)).then(data => console.log(data));

const waitTillSecond = async timeSecond => {
	const second = new Date().getSeconds();
	const delay = (60 - second + timeSecond) * 1000;

	await sleep(delay);
};

let timerId = setInterval(async () => {
	// console.log('new interval at', new Date().getSeconds());

	await waitTillSecond(10);
	// console.log('waitToFullMinute + 10 sec', new Date().getSeconds());

	const data = await batchFetch(SYMBOLS);
	// console.log(data.AAPL.bidPrice, 'AAPL bid');

	if (data.error) {
		console.log('error during fetching', data.error);
		return;
	}
	// console.time('time');
	const identical = compareCacheWithFetch(data);
	console.log(identical, 'identical');

	cachedData = data;
	// if (!identical || true) {
	if (!identical) {
		// console.log(cachedData.AAPL, new Date().getSeconds());
		await waitTillSecond(0);
		console.log('sending', new Date().getSeconds());
		sendEventsToAll(data);
	}
	// console.timeEnd('time');
}, interValTime);

function eventsHandler(req, res, queriedSymbols) {
	// console.log(queriedSymbols.split(','));

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
	// retrieve only the required symbols from the cachedData object for each respective client
	queriedSymbols.split(',').forEach(symbol => (requObj[symbol] = cachedData[symbol]));

	const data = `data: ${JSON.stringify(requObj)}\n\n`;

	res.write(data);

	const clientId = Date.now();

	// create new client based on clientID and response
	const newClient = {
		id: clientId,
		res,
		symbol: queriedSymbols,
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
	const queriedSymbols = req.query.id;
	// console.log(queriedSymbols);

	eventsHandler(req, res, queriedSymbols);
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
