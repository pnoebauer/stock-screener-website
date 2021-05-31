import {combineReducers} from 'redux';

import stockDataReducer from './stockData/stockData.reducer';
import configurationReducer from './configuration/configuration.reducer';
import sortingReducer from './sorting/sorting.reducer';

const rootReducer = combineReducers({
	stockData: stockDataReducer,
	configuration: configurationReducer,
	sorting: sortingReducer,
});

export default rootReducer;
