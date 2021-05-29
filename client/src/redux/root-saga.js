import {all, call} from 'redux-saga/effects';

import {stockDataSagas} from './stockData/stockData.sagas';

export default function* rootSaga() {
	yield all([call(stockDataSagas)]);
}
