import {StockDataTypes} from './stockData.types';

// payload will be an object with column name (symbol, interval) and row index
export const setInputField = payload => ({
	type: StockDataTypes.SET_INPUT_FIELD,
	payload,
});
