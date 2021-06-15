const calculateIndicators = require('./calculateIndicators');
const constants = require('./constants');

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

const processData = (data, lookBack) => {
	console.time('time');
	// console.log(data);
	const {candles, symbol, empty} = data;

	if (empty) return;

	let currentDataSeries = [];

	//converts all candles from API format to DB format, calculates and adds indicators to the converted candles
	const convertedCandles = candles.map((candle, index) => {
		// console.log('converting');

		//from API
		const {open, high, low, close, volume, datetime} = candle;
		const currentRow = index + 1;
		// const lookBack = 200;

		// !!!!!!--------NEEDS TO BE CHANGED TO MATCH EITHER API OR FRONTEND FORMAT
		//API to DB conversion
		let convertedCandle = {
			stock_id: symbol,
			openPrice: open,
			highPrice: high,
			lowPrice: low,
			closePrice: close,
			totalVolume: volume,
			date_time: convertToTimestamp(datetime),
		};

		// add convertedCandle to the series
		currentDataSeries.push(convertedCandle);

		// ----- FOR CALCULATING AND INSERTING INDICATORS INTO DB AS WELL (NOT REQUIRED) -----
		// if (currentRow > 1)
		if (currentRow > lookBack - constants.UNSTABLEPERIOD) {
			const parameter = 'closePrice';
			Object.keys(calculateIndicators).forEach(indicator => {
				convertedCandle[indicator] = calculateIndicators[indicator](
					currentDataSeries,
					lookBack,
					parameter
				);
			});

			// console.log(convertedCandle);
		}
		// console.log(currentDataSeries[currentDataSeries.length - 1], '-----', currentRow);

		return convertedCandle;
	});

	console.timeEnd('time');

	return convertedCandles;
};

module.exports = {
	processData,
};
