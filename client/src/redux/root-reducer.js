import {combineReducers} from 'redux';

import stockDataReducer from './stockData/stockData.reducer';
import configurationReducer from './configuration/configuration.reducer';

const rootReducer = combineReducers({
	stockData: stockDataReducer,
	configuration: configurationReducer,
});

export default rootReducer;
