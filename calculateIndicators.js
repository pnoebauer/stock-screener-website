// const sma = (dataRaw, timePeriod, parameter) => {
// 	const sma =
// 		dataRaw.reduce((accumulator, currentCandle, currentIndex) => {
// 			const parameterValue = Number(currentCandle[parameter]); //retrieve O/H/L/C from candle object
// 			if (currentIndex >= dataRaw.length - timePeriod) {
// 				return accumulator + parameterValue;
// 			} else {
// 				return accumulator;
// 			}
// 		}, 0) / timePeriod;

// 	// console.log(sma);
// 	return sma; //.toFixed(2);
// };

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

	const parameterValue = Number(currentCandle[parameter]);
	const priorEma = Number(priorCandle.ema) || 0;

	const ema = parameterValue * k + priorEma * (1 - k);

	return ema; //.toFixed(2);
};

// SMA=Price(t)×k-Price(t-N)×k+SMA(y)
//   where:
//      t=today
//      y=yesterday
//      N=number of days in SMA
//      k=1÷N
const sma = (dataRaw, timePeriod, parameter) => {
	// console.log(timePeriod, dataRaw.length);
	const k = 1 / timePeriod;

	const currentCandle = dataRaw[dataRaw.length - 1];
	const priorCandle = dataRaw[dataRaw.length - 2] || 0;
	const parameterValue = Number(currentCandle[parameter]);

	const priorSma = Number(priorCandle.sma) || 0;

	const nBarsAgoCandle = dataRaw[dataRaw.length - 1 - timePeriod] || 0;

	//check if the sma was calculated before lookBack (only true if the current index exceeds the lookback)
	// if so, return the price from that bar, otherwise zero
	const nBarsAgoPV = nBarsAgoCandle.sma ? Number(nBarsAgoCandle[parameter]) || 0 : 0;

	// SMA=Price(t)×k-Price(t-N)×k+SMA(y)
	const sma = (parameterValue - nBarsAgoPV) * k + priorSma;

	// console.log(parameterValue, nBarsAgoPV, k, priorSma, sma);

	return sma; //.toFixed(2);
};

// Current ATR = [(Prior ATR x 13) + Current TR] / 14
//   - Multiply the previous 14-day ATR by 13.
//   - Add the most recent day's TR value.
//   - Divide the total by 14

// ATR=(TR(t)+ATR(y)*(N-1))×k
//   where:
//      t=today
//      y=yesterday
//      N=number of days in ATR
//      k=1÷N

// TR = max(high(t), close(y)) - min(low(t), close(y))

const calculateTR = (candle, priorCandle) => {
	// console.log(candle, priorCandle);
	const tr =
		Math.max(candle.highPrice, priorCandle.closePrice ?? candle.highPrice) -
		Math.min(candle.lowPrice, priorCandle.closePrice ?? candle.lowPrice);

	return tr;
};

const atr = (dataRaw, timePeriod, parameter, maxLookBack) => {
	// console.log(timePeriod, dataRaw.length, maxLookBack);

	const currentCandle = dataRaw[dataRaw.length - 1];
	const priorCandle = dataRaw[dataRaw.length - 2] || 0;

	// console.log(currentCandle, priorCandle);

	const TR = calculateTR(currentCandle, priorCandle) / timePeriod;

	if (dataRaw.length <= maxLookBack) {
		// console.log('within initial lookback');

		return TR;
	}

	const atr = (priorCandle.atr * (timePeriod - 1) + TR) / timePeriod;

	return atr;
};

// import regression from 'regression';
// const result = regression.linear([[0, 1], [32, 67], [12, 79]]);
// const gradient = result.equation[0];
// const yIntercept = result.equation[1];

const regression = require('regression');

const reg = (dataRaw, timePeriod, parameter) => {
	// const currentCandle = dataRaw[dataRaw.length - 1];
	// const startCandle = dataRaw[dataRaw.length - timePeriod];

	let data = [];
	// console.log(currentCandle, startCandle);

	for (let i = dataRaw.length - timePeriod; i <= dataRaw.length - 1; i++) {
		// data.push([i - (dataRaw.length - timePeriod), Number(dataRaw[i][parameter])]);

		// natural log of price
		const lnPrice = Math.log(Number(dataRaw[i][parameter]));
		data.push([i - (dataRaw.length - timePeriod), lnPrice]);
	}

	// console.log(data[0], data[timePeriod - 1], 'data', symbol);

	// console.log(data, 'data');

	// const result = regression.exponential(data, {order: 3, precision: 3});
	// console.log(result);

	// regression of the log series
	const result = regression.linear(data, {order: 3, precision: 20});
	const slope = result.equation[0];
	// console.log(result);

	const percChangePerDay = Math.E ** slope;
	const annualizedChange = (percChangePerDay ** 250 - 1) * 100;

	// console.log(
	// 	result,
	// 	'result',
	// 	slope,
	// 	'slope',
	// 	percChangePerDay,
	// 	'percChangePerDay',
	// 	annualizedChange,
	// 	'annualizedChange'
	// );

	// console.log(
	// 	slope,
	// 	'slope',
	// 	percChangePerDay,
	// 	'percChangePerDay',
	// 	annualizedChange,
	// 	'annualizedChange',
	// 	symbol
	// );

	return annualizedChange;
};

const mom = (dataRaw, timePeriod, parameter) => {
	const currentCandle = dataRaw[dataRaw.length - 1];
	const nBarsAgoCandle = dataRaw[dataRaw.length - 1 - timePeriod] || 0;

	const mom =
		(100 * (currentCandle[parameter] - nBarsAgoCandle[parameter])) /
		currentCandle[parameter];

	// console.log(currentCandle[parameter], nBarsAgoCandle[parameter]);

	return mom;
};

module.exports = {sma, ema, atr, reg, mom};
