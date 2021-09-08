// const {SYMBOLS, UNIVERSES} = require('./constants');

// const {updateUNIVERSESfromDB} = require('./test');

// let timerId = setInterval(async () => {
// 	console.log('run');
// 	await updateUNIVERSESfromDB();
// 	console.log({SYMBOLS, UNIVERSES}, 'up');
// }, 5 * 1000);

// console.log({SYMBOLS, UNIVERSES});

const dbConnect = require('./dbConnect');

const queryObject = {
	symbol: 'MMM',
	interval: 'day',
	indicators: {
		sma: {
			parameter: 'closePrice',
			lookBack: 35,
		},
		ema: {
			parameter: 'openPrice',
			lookBack: 20,
		},
		atr: {
			lookBack: 5,
		},
		reg: {
			parameter: 'closePrice',
			lookBack: 250,
		},
		mom: {
			parameter: 'closePrice',
			lookBack: 250,
		},
	},
};

dbConnect.retrieveSampledData('MMM', 15, ['openPrice'], 'day');

// retrieveSymbolWithIndicators(queryObject).then(data => console.log(data));
