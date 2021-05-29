import {takeLatest, call, put, all} from 'redux-saga/effects'; //listens to every actions of a specific type that is passed to it

import {StockDataTypes} from './stockData.types';

// import {fetchSuccess, fetchFailure} from './stockData.actions';

export function* fetchAsync({payload}) {
	try {
		// yield put(fetchSuccess()); //put saga's equivalent to dispatch
	} catch (error) {
		// yield put(fetchFailure(error.message));
	}
}

export function* updateRow({payload}) {
	// console.log(payload, 'saga pl');
	// yield put(doSetInputField({payload})); //not required --> async and triggered in reducer already
	// yield fetchAsync();
}

export function* onFieldChange() {
	// console.log('called');
	yield takeLatest(StockDataTypes.SET_INPUT_FIELD, updateRow);
}

export function* onColumnChange() {
	// yield takeLatest(StockDataTypes.SET_INPUT_FIELD, updateRow);
}

// always start fetching if any of below action happens
export function* asyncStart() {
	yield takeLatest(
		[StockDataTypes.SET_INPUT_FIELD, StockDataTypes.SET_COLUMNS],
		fetchAsync
	);
}

export function* stockDataSagas() {
	yield all([call(onFieldChange), call(onColumnChange)]);
	// yield all([call(asyncStart)]);
}
