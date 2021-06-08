import {combineReducers} from 'redux';

import stockDataReducer from './stockData/stockData.reducer';
import configurationReducer from './configuration/configuration.reducer';
import sortingReducer from './sorting/sorting.reducer';
import filteringReducer from './filtering/filtering.reducer';
import fetchingReducer from './fetching/fetching.reducer';

const rootReducer = combineReducers({
	stockData: stockDataReducer,
	indicatorConfiguration: configurationReducer,
	sortingConfiguration: sortingReducer,
	filterRules: filteringReducer,
	fetchingStatus: fetchingReducer,
});

export default rootReducer;
