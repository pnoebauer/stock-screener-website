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
			return {...state};
		default:
			return state;
	}
};

export default stockDataReducer;
