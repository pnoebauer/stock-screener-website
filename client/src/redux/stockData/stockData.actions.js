import {StockDataTypes} from './stockData.types';

// payload is object with column name (symbol, interval) and row index
export const doSetInputField = payload => ({
	type: StockDataTypes.SET_INPUT_FIELD,
	payload,
});

// payload is array with columnNames
export const doSetColumns = payload => ({
	type: StockDataTypes.SET_COLUMNS,
	payload,
});
