const convertToTimestamp = datetime => {
	const dateObject = new Date(datetime);
	const date = dateObject.toISOString().split('T')[0];
	// const time = dateObject.toTimeString().split(' ')[0]; //local time
	const time = dateObject
		.toLocaleString('de-de', {timeZone: 'America/Chicago'})
		.split(' ')[1]; //US time

	const timestamp = `${date} ${time}`;
	return timestamp;
};

// const processData = ({candles}) => {
// 	// const dates = candles.map(candle => candle.datetime);
// 	// const dates = candles.map(candle => new Date(candle.datetime).toDateString());
// 	// console.log(candles);

// 	const convertedCandles = candles.map(candle => {
// 		return {
// 			...candle,
// 			// datetime: new Date(candle.datetime).getUTCHours(),
// 			// datetime: new Date(candle.datetime).toLocaleTimeString('en-US'),
// 			// datetime: new Date(candle.datetime).toDateString(),
// 			datetime: convertToTimestamp(candle.datetime),
// 		};
// 	});

// 	console.log(convertedCandles);
// };

const calculateIndicators = require('./calculateIndicators');

const processData = data => {
	console.time('time');
	// console.log(data);
	const {candles, symbol, empty} = data;

	if (empty) return;

	let currentDataSeries = [];

	const convertedCandles = candles.map((candle, index) => {
		const {open, high, low, close, volume, datetime} = candle;
		const currentRow = index + 1;
		const lookBack = 3;

		// candles.slice(0,currentRow)
		// currentDataSeries.push(candle);

		// if (currentRow > lookBack) {
		// 	//both operations take the same time (slicing beforehand has no benefit) - choose option 2 due to simplicity
		// 	// calculateIndicators.sma(
		// 	// 	currentDataSeries.slice(currentRow - lookBack, currentRow),
		// 	// 	lookBack,
		// 	// 	'close'
		// 	// );
		// 	calculateIndicators.sma(currentDataSeries, lookBack, 'close');
		// }

		let convertedCandle = {
			stock_id: symbol,
			open_price: open,
			high_price: high,
			low_price: low,
			close_price: close,
			volume,
			date_time: convertToTimestamp(datetime),
		};

		// currentDataSeries.push(convertedCandle);
		currentDataSeries = [...currentDataSeries, convertedCandle];
		// console.log(currentDataSeries[0], index, '-------------BEFORE');

		let sma;
		let ema = 0;

		if (currentRow > lookBack) {
			//both operations take the same time (slicing beforehand has no benefit) - choose option 2 due to simplicity
			// calculateIndicators.sma(
			// 	currentDataSeries.slice(currentRow - lookBack, currentRow),
			// 	lookBack,
			// 	'close'
			// );
			sma = calculateIndicators.sma(currentDataSeries, lookBack, 'close_price');
			ema = calculateIndicators.ema(currentDataSeries, lookBack, 'close_price');
			// console.log(sma, 'sma');
		}

		convertedCandle = {...convertedCandle, sma, ema};

		if (index == 5) {
			console.log(currentDataSeries, '---before convert');
		}
		currentDataSeries[currentDataSeries.length - 1] = {
			...currentDataSeries[currentDataSeries.length - 1],
			sma,
			ema,
		};
		if (index == 5) {
			console.log(currentDataSeries, '---after convert');
		}
		// console.log(currentDataSeries, '-----', convertedCandle, index);
		// currentDataSeries[currentDataSeries.length - 1] = 'test';
		// console.log(
		// 	currentDataSeries[currentDataSeries.length - 1],
		// 	'-----',
		// 	// convertedCandle,
		// 	index
		// );
		// console.log(currentDataSeries[0], index, '-------------AFTER');

		return convertedCandle;
	});

	console.timeEnd('time');
	// console.log(convertedCandles);

	return convertedCandles;
};

module.exports = {
	processData,
};
