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

// payload is the row index
export const doDeleteRow = payload => ({
	type: StockDataTypes.DELETE_ROW,
	payload,
});

export const doDeleteAllRows = () => ({
	type: StockDataTypes.DELETE_ALL_ROWS,
});

export const doAddRow = payload => ({
	type: StockDataTypes.ADD_ROW,
	payload,
});

export const doSetRow = payload => ({
	type: StockDataTypes.SET_ROW,
	payload,
});
