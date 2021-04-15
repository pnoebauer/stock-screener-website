const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const enforce = require('express-sslify');

const fetchData = require('./fetchData');
const processData = require('./processData');

const dbConnect = require('./dbConnect');

const constants = require('./constants');

//during testing or development
if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //load .env into process environment (adds variables from there)

const app = express(); //instantiate new express application
const port = process.env.PORT || 4000; //heroku sets up process port; during development use port 5000

// app.use(compression()); //use gzip compression in the Express app to decrease size of response body
// app.use(express.json()); //for any requests coming in, process their body tag and convert to json
// app.use(express.urlencoded({ extended: true })); //url requests that contain incorrect characters (i.e. spaces) are converted to correct ones
// app.use(enforce.HTTPS({ trustProtoHeader: true })); //always use HTTPS even if request comes from HTTP

// app.use(cors()); //allow requests from port 3000 (frontend) to port 5000 (backend)

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}

// app.get('/', (req, res) => {
// 	res.send('Hello World!');
// });

const historicalDataIntoDB = async (universes, symbols) => {
	await dbConnect.createTables();

	await dbConnect.insertIntoTableSymbols(universes);

	for (let i = 0; i < symbols.length; i++) {
		const symbol = symbols[i];
		try {
			const data = await fetchData.fetchHistoricalData(symbol, 20, 'year', 1, 'daily');
			// console.log(data);
			const convertedCandles = processData.processData(data, 200);
			// console.log(convertedCandles.length);
			await dbConnect.insertIntoTable(convertedCandles);
			console.log(`Inserted ${convertedCandles.length} candles for ${symbol}`);
		} catch (e) {
			console.log('Error inserting data for', symbol, e);
		}
	}
};
// dbConnect.createTables();
// fetchData.fetchLiveData('SPY');

// fetchData
// 	.fetchHistoricalData(['MMM'], 5, 'year', 1, 'daily')
// 	.then(data => processData.processData(data))
// 	.then(convertedCandles => console.log(convertedCandles));

// historicalDataIntoDB(['GOOGL', 'AAPL']);
// historicalDataIntoDB(constants.UNIVERSES, constants.SYMBOLS);

const calculateIndicators = require('./calculateIndicators');

// const

const lookBack = 25;

// BELOW REQUIRES VERSION 1 OF SMA CALCULATION THAT REDUCES ARRAY
// dbConnect
// 	.retrieveData('MMM', constants.UNSTABLEPERIOD + lookBack, ['close_price'])
// 	.then(data => {
// 		// console.log(data);
// 		const sma = calculateIndicators.sma(data, lookBack, 'close_price');
// 		console.log(sma, 'sma');
// 	});

// // SMA WORKS WITH BOTH VERSIONS - VERSION 2 IS PREFERED AS IT ONLY REQUIRES PRIOR SMA AND NOT WHOLE SERIES (SAME AS EMA)
// dbConnect
// 	.retrieveData('MMM', constants.UNSTABLEPERIOD + lookBack, ['close_price'])
// 	.then(data => {
// 		// console.log(data, data.length, 'l');
// 		let currentDataSeries = [];
// 		let ema;
// 		let sma;
// 		data.forEach((candle, index) => {
// 			currentDataSeries.push(candle);
// 			candle.ema = calculateIndicators.ema(currentDataSeries, lookBack, 'close_price');
// 			candle.sma = calculateIndicators.sma(currentDataSeries, lookBack, 'close_price');
// 			// console.log(candle, index);
// 			ema = candle.ema;
// 			sma = candle.sma;
// 		});
// 		// console.log(data, ema);
// 		console.log(ema, 'ema');
// 		console.log(sma, 'sma');
// 	});

const queryObject = {
	symbol: 'MMM',
	interval: 'Day',
	indicators: {
		sma: {
			parameter: 'close',
			lookBack: 20,
		},
		ema: {
			parameter: 'open',
			lookBack: 50,
		},
	},
};

const queryParameters = new Set();
let maxLookBack;
Object.keys(queryObject.indicators).forEach(indicator => {
	const {[indicator]: indObj} = queryObject.indicators;
	// console.log(indObj, indicator);

	queryParameters.add(indObj.parameter);
	maxLookBack = Math.max(indObj.lookBack);
});

console.log(queryParameters, maxLookBack);

// queryObject:
/* 
	{
		symbol: 'MMM',
		interval: 'Day',
		indicators: {
			sma: {
				parameter: 'close',
				lookBack: 20
			},
			ema: {
				parameter: 'open',
				lookBack: 50
			}
		}
	}

*/

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
