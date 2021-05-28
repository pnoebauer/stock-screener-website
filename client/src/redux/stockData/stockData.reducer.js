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
		// const {value, headerName, valueRow} = action.payload;

		// return {
		// 	...state,
		// 	[headerName]: state[headerName].map((cellValue, index) => {
		// 		if (index === valueRow) {
		// 			return value;
		// 		}
		// 		return cellValue;
		// 	}),
		// };
		case StockDataTypes.SET_COLUMNS:
			return applySetColumns(state, action);

		default:
			return state;
	}
};

const applySetInputField = (state, action) => {
	const {value, headerName, valueRow} = action.payload;

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
	const updatedColumnsNames = action.payload;

	// console.log(state, 'state');

	const nextState = {};
	// console.log(Object.keys(state), 'Object.keys(state)');

	[...updatedColumnsNames, ...Object.keys(initialState)].forEach(columnName => {
		nextState[columnName] = state[columnName] ? [...state[columnName]] : [];
	});

	// console.log(nextState, 'nextState');

	return nextState;
};

export default stockDataReducer;
