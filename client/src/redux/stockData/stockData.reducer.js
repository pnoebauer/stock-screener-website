import cloneDeep from 'lodash.clonedeep';

import {
	SYMBOLS,
	INTERVALS,
	INDICATORS_TO_API,
	API_TO_INDICATORS,
} from '../../assets/constants';

import {StockDataTypes} from './stockData.types';

const initialState = {
	Symbol: SYMBOLS.slice(0, 50),
	Interval: Array(50).fill(INTERVALS[0]),
	ID: [...Array(50)].map((a, idx) => idx),
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
		case StockDataTypes.SET_ROWS:
			return applySetRows(state, action);
		case StockDataTypes.ADD_ROW:
			return applyAddRow(state, action);
		case StockDataTypes.SET_ALL_INTERVALS:
			return applySetAllIntervals(state, action);
		case StockDataTypes.ADD_UNIVERSE:
			return applyAddUniverse(state, action);
		case StockDataTypes.UPDATE_NON_CUSTOM_INDICATORS:
			return applyUpdateNonCustomIndicators(state, action);

		default:
			return state;
	}
};

// triggered by the saga once fetching has finished (occurs after SET_INPUT_FIELD, SET_COLUMNS, ADD_ROW)
const applySetRows = (state, action) => {
	const nextState = cloneDeep(state);

	const fetchedDataArray = action.payload;

	fetchedDataArray.forEach((item, index) => {
		const {data, rowIndex} = item;
		// loops through the returned indicator object from the backend and updates the current row to the values
		for (const column in data) {
			nextState[column.toUpperCase()][rowIndex] = data[column];
		}
	});

	return nextState;
};

const applyUpdateNonCustomIndicators = (state, action) => {
	const symbols = state.Symbol;
	const apiObject = action.payload;

	// console.log(apiObject, 'ao');

	let nextState = {...state};

	const apiIndicators = Object.keys(state).flatMap(indicatorName =>
		INDICATORS_TO_API[indicatorName] ? [INDICATORS_TO_API[indicatorName]] : []
	);

	//filter out the indicators that are needed in the columns
	apiIndicators.forEach(apiIndicatorName => {
		// look up the name used for the column header (and state key)
		const stateIndicatorName = API_TO_INDICATORS[apiIndicatorName];

		// console.log(apiIndicatorName, 'apiIndicatorName', stateIndicatorName);

		// converts api object to state array format
		nextState = {
			...nextState,
			[stateIndicatorName]: symbols.map(
				symbolName =>
					// apiObject[symbolName][apiIndicatorName]
					(apiObject &&
						apiObject[symbolName] &&
						apiObject[symbolName][apiIndicatorName]) ??
					0
			),
		};
	});

	return nextState;
};

const applyAddUniverse = (state, action) => {
	const {addedStocks} = action.payload;
	const nextState = {...state};

	let maxId = Math.max(...state.ID, 0);
	// const currentStockNumber = state.Symbol.length;
	const addedStockNumber = addedStocks.length;

	Object.keys(state).forEach(columnName => {
		switch (columnName) {
			case 'Symbol':
				nextState.Symbol = [...nextState.Symbol, ...addedStocks];
				break;
			case 'Interval':
				nextState.Interval = [
					...nextState.Interval,
					...Array(addedStockNumber).fill(INTERVALS[0]),
				];
				break;
			case 'ID':
				nextState.ID = [
					...nextState.ID,
					...Array(addedStockNumber)
						.fill()
						.map((_, i) => i + maxId),
				];
				break;
			default:
				nextState[columnName] = [
					...nextState[columnName],
					...Array(addedStockNumber).fill(0),
				];
		}
	});

	return nextState;
};

const applySetAllIntervals = (state, action) => {
	const newInterval = action.payload;

	return {
		...state,
		Interval: state.Interval.map(interval => newInterval),
	};
};

// triggered by the saga once fetching has finished (occurs after SET_INPUT_FIELD, SET_COLUMNS, ADD_ROW)
const applySetRow = (state, action) => {
	const nextState = {...state};

	const {data, rowIndex} = action.payload;

	// loops through the returned indicator object from the backend and updates the current row to the values
	for (const column in data) {
		nextState[column.toUpperCase()] = nextState[column.toUpperCase()].map(
			(value, index) => (index === rowIndex ? data[column] : value)
		);
	}

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

const applySetInputField = (state, action) => {
	const {value, headerName, valueRow} = action.payload;

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

const applyAddRow = (state, action) => {
	const {value, headerName} = action.payload;

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
