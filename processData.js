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

const processData = data => {
	console.log(data);
	const {candles, symbol, empty} = data;

	if (empty) return;

	// console.log(candles);

	const convertedCandles = candles.map(candle => {
		const {open, high, low, close, volume, datetime} = candle;
		return {
			stock_id: symbol,
			datetime,
			open_price: open,
			high_price: high,
			low_price: low,
			close_price: close,
			volume,
			datetime: convertToTimestamp(candle.datetime),
		};
	});

	// console.log(convertedCandles);
};

module.exports = {
	processData,
};
