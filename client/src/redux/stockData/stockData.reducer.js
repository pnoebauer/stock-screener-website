import {SYMBOLS, INTERVALS} from '../../assets/constants';

import {StockDataTypes} from './stockData.types';

const initialState = {
	Symbol: SYMBOLS.slice(0, 5),
	Interval: Array(5).fill(INTERVALS[0]),
	ID: [...Array(5)].map((a, idx) => idx),
};

const stockDataReducer = (state = initialState, action) => {
	switch (action.type) {
		case StockDataTypes.SET_INPUT_FIELD:
			return applySetInputField(state, action);
		case StockDataTypes.SET_COLUMNS:
			return applySetColumns(state, action);
		case StockDataTypes.DELETE_ROW:
			return applyDeleteRow(state, action);
		case StockDataTypes.DELETE_ALL_ROWS:
			return applyDeleteAllRows(state, action);
		case StockDataTypes.SET_ROW:
			return applySetRow(state, action);
		// case StockDataTypes.ADD_ROW:
		// 	return applyAddRow(state, action);

		default:
			return state;
	}
};

const applySetRow = (state, action) => {
	const nextState = {...state};

	const {data, rowIndex} = action.payload;

	// console.log(data, rowIndex, 'data,rowIndex', state);

	for (const column in data) {
		nextState[column.toUpperCase()] = nextState[column.toUpperCase()].map(
			(value, index) => (index === rowIndex ? data[column] : value)
		);
	}

	// console.log(nextState, 'nextState');

	return nextState;
};

const applyDeleteAllRows = (state, action) => {
	const nextState = {};

	for (const column in state) {
		nextState[column] = [];
	}

	return nextState;
};

const applyDeleteRow = (state, action) => {
	const deleteRowIdx = action.payload;

	const nextState = {};

	for (const column in state) {
		nextState[column] = state[column].filter((item, index) => index !== deleteRowIdx);
	}

	return nextState;
};

const applyAddRow = (state, action) => {
	const {value, headerName, valueRow} = action.payload;

	const nextState = {};

	for (const column in state) {
		let addedValue;

		switch (column) {
			case headerName:
				addedValue = value;
				break;
			case 'Interval':
				addedValue = INTERVALS[0];
				break;
			case 'ID':
				addedValue = Math.max(...state.ID, 0) + 1;
				break;
			default:
				addedValue = 0;
		}

		nextState[column] = [...state[column], addedValue];
	}

	return nextState;
};

const applySetInputField = (state, action) => {
	const {value, headerName, valueRow} = action.payload;

	if (valueRow >= state.Symbol.length) {
		return applyAddRow(state, action);
	}

	// updates the array index (=valueRow) to the new value in the state column (=headerName)
	return {
		...state,
		[headerName]: state[headerName].map((cellValue, index) => {
			if (index === valueRow) {
				return value;
			}
			return cellValue;
		}),
	};
};

const applySetColumns = (state, action) => {
	const updatedColumnNames = action.payload;

	const nextState = {};

	// loop through fixed (symbol, interval, etc) and set columns
	// if it exists in current state use it, else set it to an empty array (will be updated by another action)
	[...Object.keys(initialState), ...updatedColumnNames].forEach(columnName => {
		// nextState[columnName] = state[columnName] ? [...state[columnName]] : [];
		nextState[columnName] = state[columnName]
			? [...state[columnName]]
			: Array(state.Symbol.length).fill(0);
	});

	return nextState;
};

export default stockDataReducer;
