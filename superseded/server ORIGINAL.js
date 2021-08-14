const express = require('express');

const cors = require('cors');
// const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const enforce = require('express-sslify');

const fetchData = require('../fetchData');
const processData = require('../processData');

const dbConnect = require('../dbConnect');

const constants = require('../constants');

const calculateIndicators = require('../calculateIndicators');

//during testing or development
if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //load .env into process environment (adds variables from there)

const app = express(); //instantiate new express application
const port = process.env.PORT || 4000; //heroku sets up process port; during development use port 5000

// app.use(compression()); //use gzip compression in the Express app to decrease size of response body
app.use(express.json()); //for any requests coming in, process their body tag and convert to json
// app.use(express.urlencoded({ extended: true })); //url requests that contain incorrect characters (i.e. spaces) are converted to correct ones
// app.use(enforce.HTTPS({ trustProtoHeader: true })); //always use HTTPS even if request comes from HTTP

app.use(cors()); //allow requests from port 3000 (frontend) to port 5000 (backend)

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}

app.get('/', (req, res) => {
	console.log('request received');
	// res.send('Hello World!');
	res.json('This is working');
});

const historicalDataIntoDB = async (universes, symbols) => {
	await dbConnect.createTables();
	await dbConnect.insertIntoTableSymbols(universes);

	for (let i = 0; i < symbols.length; i++) {
		const symbol = symbols[i];
		try {
			const data = await fetchData.fetchHistoricalData(symbol, 20, 'year', 1, 'daily');
			// console.log(data);

			// IF NO LOOKBACK IS PROVIDED NO INDICATORS WILL BE ADDED BUT ONLY CANDLES CONVERTED FOR DB
			const convertedCandles = processData.processData(data, 200);
			// const convertedCandles = processData.processData(data);
			// console.log(convertedCandles[convertedCandles.length - 1]);
			// console.log(convertedCandles.length);
			await dbConnect.insertIntoTable(convertedCandles);
			console.log(`Inserted ${convertedCandles.length} candles for ${symbol}`);
		} catch (e) {
			console.log('Error inserting data for', symbol, e);
		}
	}
};
// historicalDataIntoDB(constants.UNIVERSES, ['GOOGL', 'AAPL']);
// historicalDataIntoDB(constants.UNIVERSES, ['AAPL']);
historicalDataIntoDB(constants.UNIVERSES, constants.SYMBOLS);

// dbConnect.createTables();
// fetchData.fetchLiveData('GOOGL').then(data => console.log(data.GOOGL.closePrice));
// fetchData.fetchLiveData('SPY').then(data => console.log(data));

// fetchData
// 	.fetchHistoricalData(['MMM'], 5, 'year', 1, 'daily')
// 	.then(data => processData.processData(data, 200))
// 	.then(convertedCandles => console.log(convertedCandles[convertedCandles.length - 1]));

// repeat with the interval of 2 seconds
// let timerId = setInterval(() => console.log('tick'), 2000);
// let timerId = setInterval(
// 	() => fetchData.fetchLiveData('SPY').then(data => console.log(data.SPY.lastPrice)),
// 	10000
// );

// // after 5 seconds stop
// setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);

const lookBack = 25;

const getLatestIndicators = async (queryObject, data) => {
	// calculate the indicators after retrieving the data
	let currentDataSeries = [];
	data.forEach((candle, index) => {
		currentDataSeries.push(candle);

		Object.keys(queryObject.indicators).forEach(indicator => {
			let {parameter, lookBack} = queryObject.indicators[indicator];
			lookBack = Number(lookBack);

			// start the calculation once the index is within the lookback of the current bar
			if (index >= maxLookBack - lookBack) {
				// console.log(indicator);
				candle[indicator] = calculateIndicators[indicator](
					currentDataSeries,
					lookBack,
					parameter
				);
				// round the final result
				if (index === data.length - 1) {
					candle[indicator] = candle[indicator].toFixed(2);
					// console.log(candle, 'last candle');
				}
			}
		});

		// console.log(candle, index);
	});

	// console.log(currentDataSeries[currentDataSeries.length - 1], 'candle');
	return currentDataSeries[currentDataSeries.length - 1];
};

const retrieveSymbolWithIndicators = async queryObject => {
	// console.log(queryObject);

	// determine the maximum lookback and all unique parameters (for data retrieval from the db)
	const queryParameters = new Set();
	let maxLookBack = 1;
	Object.keys(queryObject.indicators).forEach(indicator => {
		const {[indicator]: indObj} = queryObject.indicators; // destructure out the indicator
		// console.log(indObj, indicator);

		queryParameters.add(indObj.parameter); // add the parameter to the set (i.e. OHLC)
		maxLookBack = Math.max(maxLookBack, indObj.lookBack); //find the max lookback to be retrieved from the db
	});

	// console.log(queryParameters, maxLookBack);

	// retrieve data
	const latestPriceData = await dbConnect.retrieveData(
		queryObject.symbol,
		constants.UNSTABLEPERIOD + maxLookBack,
		Array.from(queryParameters)
	);

	// console.log(latestPriceData, 'latestPriceData');
	const lastCandle = getLatestIndicators(queryObject, latestPriceData, maxLookBack);

	return lastCandle;
};

// const retrieveSymbolWithIndicators = async queryObject => {
// 	// console.log(queryObject);

// 	// determine the maximum lookback and all unique parameters (for data retrieval from the db)
// 	const queryParameters = new Set();
// 	let maxLookBack = 1;
// 	Object.keys(queryObject.indicators).forEach(indicator => {
// 		const {[indicator]: indObj} = queryObject.indicators; // destructure out the indicator
// 		// console.log(indObj, indicator);

// 		queryParameters.add(indObj.parameter); // add the parameter to the set (i.e. OHLC)
// 		maxLookBack = Math.max(maxLookBack, indObj.lookBack); //find the max lookback to be retrieved from the db
// 	});

// 	// console.log(queryParameters, maxLookBack);

// 	// retrieve data
// 	const data = await dbConnect.retrieveData(
// 		queryObject.symbol,
// 		constants.UNSTABLEPERIOD + maxLookBack,
// 		Array.from(queryParameters)
// 	);

// 	// console.log(data);

// 	// calculate the indicators after retrieving the data
// 	let currentDataSeries = [];
// 	data.forEach((candle, index) => {
// 		currentDataSeries.push(candle);

// 		Object.keys(queryObject.indicators).forEach(indicator => {
// 			let {parameter, lookBack} = queryObject.indicators[indicator];
// 			lookBack = Number(lookBack);

// 			// start the calculation once the index is within the lookback of the current bar
// 			if (index >= maxLookBack - lookBack) {
// 				// console.log(indicator);
// 				candle[indicator] = calculateIndicators[indicator](
// 					currentDataSeries,
// 					lookBack,
// 					parameter
// 				);
// 				// round the final result
// 				if (index === data.length - 1) {
// 					candle[indicator] = candle[indicator].toFixed(2);
// 					// console.log(candle, 'last candle');
// 				}
// 			}
// 		});

// 		// console.log(candle, index);
// 	});

// 	// console.log(currentDataSeries[currentDataSeries.length - 1], 'candle');
// 	return currentDataSeries[currentDataSeries.length - 1];
// };

const queryObject = {
	symbol: 'MMM',
	interval: 'Day',
	indicators: {
		sma: {
			parameter: 'closePrice',
			lookBack: 90,
		},
		ema: {
			parameter: 'openPrice',
			lookBack: 210,
		},
	},
};

// retrieveSymbolWithIndicators(queryObject);

app.post('/scanner', (req, res) => {
	// const {symbol} = req.body;
	// console.log(req.body, symbol);
	const queryObject = req.body;

	// retrieveSymbolWithIndicators(queryObject).then(data => res.send(data));
	retrieveSymbolWithIndicators(queryObject).then(data => res.json(data));
});

// // dbConnect.ins();

app.listen(port, error => {
	if (error) throw error;
	console.log('Server running on port', port);
});

/* -------------------- FETCHING API RULES -------------------- */
/* symbol, period, periodType, frequency, frequencyType (shift-option-A)*/
// periods by periodType:
// day: 1, 2, 3, 4, 5, 10*
// month: 1*, 2, 3, 6
// year: 1*, 2, 3, 5, 10, 15, 20
// ytd: 1*
// frequencyTypes by periodType (defaults marked with an asterisk):
// day: minute*				(only day has minute bars --> day only goes back 10 periods/days --> only viable is above daily)
// month: daily, weekly*
// year: daily, weekly, monthly*
// ytd: daily, weekly*
// frequencies by frequencyType:
// minute: 1*, 5, 10, 15, 30
// daily: 1*
// weekly: 1*
// monthly: 1*
/* -------------------- FETCHING API RULES -------------------- */

/* 
function every8am (yourcode) {
    var now = new Date(),
        start,
        wait;

    if (now.getHours() < 7) {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0);
    } else {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 0, 0, 0);
    }

    wait = start.getTime() - now.getTime();

    if(wait <= 0) { //If missed 8am before going into the setTimeout
        console.log('Oops, missed the hour');
        every8am(yourcode); //Retry
    } else {
        setTimeout(function () { //Wait 8am
            setInterval(function () {
                yourcode();
            }, 86400000); //Every day
        },wait);
    }
}

var yourcode = function () {
        console.log('This will print evryday at 8am');
    };
every8am(yourcode);


function at8am (yourcode) {
    var now = new Date(),
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0);

    if (now.getTime() >= start.getTime() - 2500 && now.getTime() < start.getTime() + 2500) {
        yourcode();
    }
}
 */
