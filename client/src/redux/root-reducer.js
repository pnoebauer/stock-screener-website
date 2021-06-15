import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import stockDataReducer from './stockData/stockData.reducer';
import configurationReducer from './configuration/configuration.reducer';
import sortingReducer from './sorting/sorting.reducer';
import filteringReducer from './filtering/filtering.reducer';
import fetchingReducer from './fetching/fetching.reducer';

const persistConfig = {
	key: 'root',
	storage: storage,
	blacklist: ['fetchingStatus'],
};

const rootReducer = combineReducers({
	stockData: stockDataReducer,
	indicatorConfiguration: configurationReducer,
	sortingConfiguration: sortingReducer,
	filterRules: filteringReducer,
	fetchingStatus: fetchingReducer,
});

// export default rootReducer;

export default persistReducer(persistConfig, rootReducer);
