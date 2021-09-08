const express = require('express');

const cors = require('cors');

const fetchData = require('./fetchData');

const {SYMBOLS, API_TO_INDICATORS, UNIVERSES, UNSTABLEPERIOD} = require('./constants');

const processData = require('./processData');

const dbConnect = require('./dbConnect');

const calculateIndicators = require('./calculateIndicators');

const {sleep, waitTillSecond} = require('./utils');

//during testing or development
if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //load .env into process environment (adds variables from there)

const app = express(); //instantiate new express application
const PORT = 4000;

app.use(express.json()); //for any requests coming in, process their body tag and convert to json
app.use(express.urlencoded({extended: true})); //url requests that contain incorrect characters (i.e. spaces) are converted to correct ones
app.use(cors()); //allow requests from port 3000 (frontend) to port 5000 (backend)

app.listen(PORT, error => {
	if (error) throw error;
	console.log('Server running on port', PORT);
});

let clients = [];
let cachedData = {};

// fetchData.fetchLiveData(['SPY']).then(data => console.log(data));

// // helper function to wait in async function till ms have passed
// function sleep(ms) {
// 	return new Promise(resolve => setTimeout(resolve, ms));
// }

// // helper function to wait till time has reached a certain second (e.g. 10 --> async function will await till 01:30:10, 01:31:10, etc.)
// const waitTillSecond = async timeSecond => {
// 	const second = new Date().getSeconds();
// 	const delay = (60 - second + timeSecond) * 1000;

// 	await sleep(delay);
// };

//only keep required indicators and remove unnessary ones such as:
//  	quoteTimeInLong, tradeTimeInLong, regularMarketTradeTimeInLong
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

// fetch x symbols at a time and then waits till fetching again
// used to overcome API data limit
const batchFetch = async symbolList => {
	let startIndex = 0;
	let endIndex = symbolsPerSplit;
	let data = {};
	// split fetch call into 5 equal parts
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

		// sleep after a batch except the final one
		if (i !== splits - 1) {
			// console.log('waiting', Math.round(interValTime / (splits + 2)), 'ms');
			await sleep(interValTime / (splits + 2)); //make sure that all fetches are done before the next round
		}
	}
	// console.log(data.AAPL.bidPrice, 'AAPL bid');

	return data;
};

//check if data has changed since the last fetch (use to only send data to front end users if the data has changed)
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
		if (!identical) break;
	}

	return identical;
};

// batchFetch(SYMBOLS.slice(0, 5)).then(data => console.log(data));

// handler function for sending the queried data to client and adds the client to clients array
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

	const clientData = {};
	// retrieve only the required symbols from the cachedData object for each respective client
	queriedSymbols.split(',').forEach(symbol => (clientData[symbol] = cachedData[symbol]));

	const data = `data: ${JSON.stringify(clientData)}\n\n`;

	// send the data object to the client
	res.write(data);

	const clientId = Date.now();

	// create new client based on clientID and response
	const newClient = {
		id: clientId,
		res,
		queriedSymbols,
	};

	// console.log(newClient, 'newClient');
	console.log(clientId, 'clientId');

	// add this client to clients array (clients is a global variable)
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
	// client send queriedSymbols through url query string
	const queriedSymbols = req.query.id;
	// console.log(queriedSymbols);

	// add client to clients array and send the data of all queriedSymbols
	eventsHandler(req, res, queriedSymbols);
});

// const eventType = 'test';

// sendEventsToAll iterates the clients array and uses the write method of each Express object to send the update
function sendEventsToAll(data) {
	// loop through global clients array
	clients.forEach(client => {
		// console.log(client) ||
		// console.log(client.id);
		// const clientData = data[client.symbol];
		const clientData = {};
		// client.queriedSymbols.split(',').forEach(symbol => (clientData[symbol] = cachedData[symbol]));
		client.queriedSymbols
			.split(',')
			.forEach(symbol => (clientData[symbol] = data[symbol]));

		// const data = `data: ${JSON.stringify(clientData)}\n\n`;
		client.res.write(
			// `data: ${JSON.stringify(data)}\n\n`
			`data: ${JSON.stringify(clientData)}\n\n`
			// specify event type so that frontend can only listen to this type of event
			// `event: ${eventType}\ndata: ${JSON.stringify(clientData)}\n\n`
		);
	});
}

// ------------ return custom indicators ------------
// --------------------------------------------------

const serialIndicators = ['reg', 'mom'];

// calculates the indicators after retrieving the data
const getLatestIndicators = async (queryObject, data, maxLookBack) => {
	let currentDataSeries = [];

	// used to store the end result
	let latestIndicators = {};

	// indicators that do not require the whole series
	const reqDiscreteIndicators = Object.keys(queryObject.indicators).filter(
		indicator => !serialIndicators.includes(indicator)
	);
	const reqSerialIndicators = Object.keys(queryObject.indicators).filter(indicator =>
		serialIndicators.includes(indicator)
	);

	data.forEach((candle, index) => {
		// console.log(candle, 'candle', currentDataSeries, index);
		// push the candle into the currentDataSeries array (due to pushing (pass by ref), if the candle is mutated later on it will also updated in the series)
		currentDataSeries.push(candle);
		// console.log(currentDataSeries, 'currentDataSeries', index);

		// loop over all requested indicators
		// Object.keys(reqDiscreteIndicators).forEach(indicator => {
		for (const indicator of reqDiscreteIndicators) {
			// get the requested lookback and parameter from the queryObject
			let {parameter, lookBack} = queryObject.indicators[indicator];
			lookBack = Number(lookBack);

			// console.log(index, maxLookBack, lookBack, indicator);

			// start the calculation once the index is within the lookback (+UNSTABLEPERIOD) of the current bar
			if (index >= maxLookBack - lookBack) {
				// console.log(
				// 	indicator,
				// 	maxLookBack,
				// 	maxLookBack + UNSTABLEPERIOD - 1,
				// 	index
				// );
				// at the calculated indicator to the candle object (will also update in the currentDataSeries array due to pass by ref)
				candle[indicator] = calculateIndicators[indicator](
					currentDataSeries,
					lookBack,
					parameter,
					maxLookBack
				);
				// round the final result
				if (index === data.length - 1) {
					// candle[indicator] = candle[indicator]
					// round to two decimals
					candle[indicator] = Math.round(candle[indicator] * 100) / 100;
					// console.log(candle, 'last candle');
					latestIndicators[indicator] = candle[indicator];
				}
			}
			// });
		}
		// console.log(candle, index);
	});

	for (const indicator of reqSerialIndicators) {
		let {parameter, lookBack} = queryObject.indicators[indicator];
		lookBack = Number(lookBack);

		// latestIndicators[indicator] = calculateIndicators[indicator](
		// 	data,
		// 	lookBack,
		// 	parameter
		// )
		// round to two decimals
		latestIndicators[indicator] =
			Math.round(calculateIndicators[indicator](data, lookBack, parameter) * 100) / 100;
	}

	return latestIndicators;
};

const retrieveSymbolWithIndicators = async queryObject => {
	try {
		// console.log(queryObject);

		// determine the maximum lookback and all unique parameters (for data retrieval from the db)
		const queryParameters = new Set();
		let maxLookBack = 1;
		Object.keys(queryObject.indicators).forEach(indicator => {
			const {[indicator]: indObj} = queryObject.indicators; // destructure out the indicator
			// console.log(indObj, indicator);

			if (!indObj.parameter) {
				['openPrice', 'highPrice', 'lowPrice', 'closePrice'].forEach(parameter =>
					queryParameters.add(parameter)
				);
			} else {
				queryParameters.add(indObj.parameter); // add the parameter to the set (i.e. OHLC)
			}

			maxLookBack = Math.max(maxLookBack, indObj.lookBack); //find the max lookback to be retrieved from the db
		});

		// console.log(queryParameters, maxLookBack);

		// retrieve data
		const latestPriceData = await dbConnect.retrieveSampledData(
			queryObject.symbol,
			UNSTABLEPERIOD + maxLookBack,
			Array.from(queryParameters),
			queryObject.interval
		);

		// console.log(latestPriceData, 'latestPriceData');

		const lastCandle = getLatestIndicators(queryObject, latestPriceData, maxLookBack);

		return lastCandle;
	} catch (e) {
		console.log('error retrieving symbol with indicators', e);
		return {};
	}
};

// const queryObject = {
// 	symbol: 'MMM',
// 	interval: 'day',
// 	indicators: {
// 		sma: {
// 			parameter: 'closePrice',
// 			lookBack: 35,
// 		},
// 		ema: {
// 			parameter: 'openPrice',
// 			lookBack: 20,
// 		},
// 		atr: {
// 			lookBack: 5,
// 		},
// 		reg: {
// 			parameter: 'closePrice',
// 			lookBack: 250,
// 		},
// 		mom: {
// 			parameter: 'closePrice',
// 			lookBack: 250,
// 		},
// 	},
// };
// // retrieveSymbolWithIndicators(queryObject).then(data => console.log(data));

app.get('/universes', (req, res) => {
	return res.json(UNIVERSES);
});

app.post('/scanner', (req, res) => {
	// const {symbol} = req.body;
	// console.log(req.body, symbol);
	const queryObject = req.body;
	// console.log(queryObject, new Date().getSeconds(), 'qo');

	retrieveSymbolWithIndicators(queryObject).then(data => {
		// console.log(queryObject, data);
		return res.json(data);
	});
});

app.post('/chart', (req, res) => {
	// const {symbol} = req.body;
	// console.log(req.body, symbol);
	const queryObject = req.body;
	// console.log({queryObject});

	const {symbol, lookBack, samplePeriod, endDate} = queryObject;

	dbConnect
		.retrieveSampledChartData(symbol, lookBack, samplePeriod, endDate)
		.then(data => {
			// console.log({data});
			return res.json(data);
		});

	// retrieveSymbolWithIndicators(queryObject).then(data => {
	// 	// console.log(queryObject, data);
	// 	return res.json(data);
	// });
});

const historicalDataIntoDB = async (universes, symbols, numberYears) => {
	await dbConnect.createTables();
	await dbConnect.insertIntoTableSymbols(universes);

	for (let i = 0; i < symbols.length; i++) {
		const symbol = symbols[i];
		try {
			const data = await fetchData.fetchHistoricalData(
				symbol,
				numberYears,
				'year',
				1,
				'daily'
			);

			// console.log(data, 'fetched');

			// IF NO LOOKBACK IS PROVIDED NO INDICATORS WILL BE ADDED BUT ONLY CANDLES CONVERTED FOR DB
			// const convertedCandles = processData.processData(data, 200);
			const convertedCandles = processData.processData(data);

			if (!convertedCandles) throw 'dataset is empty';

			// console.log(convertedCandles[convertedCandles.length - 1]);

			// console.log(convertedCandles.length);
			await dbConnect.insertIntoTable(convertedCandles);
			console.log(
				`Inserted ${convertedCandles.length} candles for ${symbol}, index ${i}`
			);
		} catch (e) {
			console.log('Error inserting data for', symbol, e);
		}
	}

	return true;
};

const regularDataUpdate = async () => {
	await waitTillSecond(10);
	// console.log('waitToFullMinute + 10 sec', new Date().getSeconds());

	const data = await batchFetch(SYMBOLS);
	// console.log(data.AAPL.bidPrice, 'AAPL bid');

	if (data.error) {
		console.log('error during fetching', data.error);
		return;
	}
	// console.time('time');
	// check if data has changed since the last fetch
	const identical = compareCacheWithFetch(data);
	console.log(identical, 'identical');

	cachedData = data;
	// if (!identical || true) {
	// if the data has changed since the last fetch send it to all clients
	if (!identical) {
		// console.log(cachedData.AAPL, new Date().getSeconds());
		await waitTillSecond(0);
		console.log('sending', new Date().getSeconds());
		sendEventsToAll(data);
	}
	// console.timeEnd('time');
};

let lastHistoricalUpdate;
let dailyUpdateHasRun;

let timerId = setInterval(async () => {
	console.log('new interval at', new Date().getSeconds(), lastHistoricalUpdate);

	// await regularDataUpdate();

	// run only once a day
	if (new Date().getDate() !== lastHistoricalUpdate) {
		dailyUpdateHasRun = false;
		console.log(new Date().getDate(), lastHistoricalUpdate, 'different');

		lastHistoricalUpdate = new Date().getDate();

		// on the weekend update the last 20 years, during the week only the last 1 year
		const numberYears = new Date().getDay() < 6 ? 1 : 20;

		dailyUpdateHasRun = await historicalDataIntoDB(UNIVERSES, SYMBOLS, numberYears);
		// console.log(dailyUpdateHasRun, 'dailyUpdateHasRun');
	}
	// make sure that the daily update has run before continuing with the regular updates so that the API limit is not exceeded
	else if (dailyUpdateHasRun) {
		// console.log(new Date().getDate(), lastHistoricalUpdate, 'equal');
		await regularDataUpdate();
	}
}, interValTime);

// historicalDataIntoDB(UNIVERSES, ['GOOGL', 'AAPL'], 1);
// historicalDataIntoDB(UNIVERSES, ['MMM'],20);
// historicalDataIntoDB(UNIVERSES, SYMBOLS,1);
