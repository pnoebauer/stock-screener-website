const sma = (dataRaw, timePeriod, parameter) => {
	const sma =
		dataRaw.reduce((accumulator, currentCandle, currentIndex) => {
			const parameterValue = Number(currentCandle[parameter]); //retrieve O/H/L/C from candle object
			if (currentIndex >= dataRaw.length - timePeriod) {
				return accumulator + parameterValue;
			} else {
				return accumulator;
			}
		}, 0) / timePeriod;

	// console.log(sma);
	return sma.toFixed(2);
};

// EMA=Price(t)×k+EMA(y)×(1−k)
//   where:
//      t=today
//      y=yesterday
//      N=number of days in EMA
//      k=2÷(N+1)
const ema = (dataRaw, time_period, parameter) => {
	const k = 2 / (time_period + 1);

	const currentCandle = dataRaw[dataRaw.length - 1];
	const priorCandle = dataRaw[dataRaw.length - 2] || 0;

	const parameterValue = currentCandle[parameter];
	const priorEma = priorCandle.ema || 0;

	const ema = parameterValue * k + priorEma * (1 - k);

	return ema.toFixed(2);
};

module.exports = {sma, ema};
