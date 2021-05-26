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
			// const {value, headerCol, valueRow} = action.payload;
			// const headerName = Object.keys(state)[headerCol];
			// console.log(headerName, 'headerName');

			// return {
			// 	...state,
			// 	[headerName]: state[headerName].map((cellValue, index) => {
			// 		if (index === valueRow) {
			// 			return value;
			// 		}
			// 		return cellValue;
			// 	}),
			// };
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
		default:
			return state;
	}
};

export default stockDataReducer;
