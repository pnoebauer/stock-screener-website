import {combineReducers} from 'redux';

import stockDataReducer from './stockData/stockData.reducer';

const rootReducer = combineReducers({
	stockData: stockDataReducer,
});

export default rootReducer;
