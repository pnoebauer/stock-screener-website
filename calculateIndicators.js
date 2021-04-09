const sma = (dataRaw, timePeriod, parameter) => {
	const sma =
		dataRaw.reduce((accumulator, currentCandle, currentIndex) => {
			const parameterValue = currentCandle[parameter];
			if (currentIndex >= dataRaw.length - timePeriod) {
				// console.log(currentIndex, dataRaw.length, accumulator, parameterValue);
				return accumulator + parameterValue;
			} else {
				return accumulator;
			}
		}, 0) / timePeriod;

	// console.log(sma);
	return sma;
};

// const ema = (dataRaw, time_period, parameter) => {
//     let data = extractData(dataRaw, parameter)
//     const k = 2/(time_period + 1)
//     let emaData = []
//     emaData[0] = data[0]
//     for (let i = 1; i < data.length; i++) {
//         let newPoint = (data[i] * k) + (emaData[i-1] * (1-k))
//         emaData.push(newPoint)
//     }
//     let currentEma = [...emaData].pop()
//     return +currentEma.toFixed(2)
// }

// EMA=Price(t)×k+EMA(y)×(1−k)
//   where:
//      t=today
//      y=yesterday
//      N=number of days in EMA
//      k=2÷(N+1)
const ema = (dataRaw, time_period, parameter) => {
	// let data = extractData(dataRaw, parameter)
	const k = 2 / (time_period + 1);
	// let emaData = []
	// emaData[0] = data[0]
	// for (let i = 1; i < data.length; i++) {
	// 	const currentCandle = dataRaw[i]
	// 	const parameterValue = currentCandle[parameter];
	// 	const prior
	//     let newPoint = (data[i] * k) + (emaData[i-1] * (1-k))
	//     emaData.push(newPoint)
	// }
	// let currentEma = [...emaData].pop()
	// return +currentEma.toFixed(2)
	const currentCandle = dataRaw[0];
	const priorCandle = dataRaw[1];
	// console.log(currentCandle, priorCandle, 'cc pc------------');
	// console.log(dataRaw, '------------');
	const parameterValue = currentCandle[parameter];
	const priorEma = priorCandle.ema;
	const ema = parameterValue * k + priorEma * (1 - k);

	return ema;
};

module.exports = {sma, ema};
