import {FilteringTypes} from './filtering.types';
import {StockDataTypes} from '../stockData/stockData.types';

const initialState = [];

const filteringReducer = (state = initialState, action) => {
	switch (action.type) {
		case FilteringTypes.SET_FILTER_RULES:
			return applySetFilterRules(null, action);
		case StockDataTypes.SET_COLUMNS:
			return applyResetFilterRules();
		default:
			return state;
	}
};

const applySetFilterRules = (_, action) => {
	const rules = action.payload;
	return rules;
};

const applyResetFilterRules = () => {
	return [];
};

export default filteringReducer;
