const processData = ({candles}) => {
	// const dates = candles.map(candle => candle.datetime);
	const dates = candles.map(candle => new Date(candle.datetime).toDateString());
	console.log(dates);
};

module.exports = {
	processData,
};
