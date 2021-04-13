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

// const historicalDataIntoDB = async symbol => {
// 	try {
// 		const data = await fetchData.fetchHistoricalData(symbol);
// 		// console.log(data);
// 		const convertedCandles = processData.processData(data);
// 		// console.log(convertedCandles);

// 		await dbConnect.insertIntoTable(convertedCandles);
// 	} catch (e) {
// 		console.log(e);
// 	}
// };

const historicalDataIntoDB = async (universes, symbols) => {
	await dbConnect.createTables();

	await dbConnect.insertIntoTableSymbols(universes);

	for (let i = 0; i < symbols.length; i++) {
		const symbol = symbols[i];
		try {
			const data = await fetchData.fetchHistoricalData(symbol);
			// console.log(data);
			const convertedCandles = processData.processData(data);
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

// historicalDataIntoDB(['GOOGL', 'AAPL']);
// historicalDataIntoDB(constants.UNIVERSES, constants.SYMBOLS);

const calculateIndicators = require('./calculateIndicators');
dbConnect.retrieveData('MMM', 10, 'close_price').then(data => {
	console.log(data);
	const sma = calculateIndicators.sma(data, 5, 'close_price');
	console.log(sma);
});
// dbConnect.ins();

app.listen(port, error => {
	if (error) throw error;
	console.log('Server running on port', port);
});
