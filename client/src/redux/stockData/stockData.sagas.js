import {takeLatest, call, put, select, all} from 'redux-saga/effects'; //listens to every actions of a specific type that is passed to it

import {StockDataTypes} from './stockData.types';
import {getCustomIndicatorReqObj} from './stockData.selectors';

// import {fetchSuccess, fetchFailure} from './stockData.actions';

import {doSetRow} from './stockData.actions';

export function* fetchAsync({payload}) {
	try {
		// yield put(fetchSuccess()); //put saga's equivalent to dispatch
	} catch (error) {
		// yield put(fetchFailure(error.message));
	}
}

export function* fetchCustomIndicators(requestObj, rowIndex) {
	try {
		const response = yield fetch('http://localhost:4000/scanner', {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestObj), // body data type must match "Content-Type" header
		});

		const data = yield response.json();
		console.log(data, 'data');

		const payload = {data, rowIndex};

		yield put(doSetRow(payload));

		// yield put(fetchSuccess()); //put saga's equivalent to dispatch
	} catch (error) {
		// yield put(fetchFailure(error.message));
	}
}

export function* updateRow({payload}) {
	console.log(payload, 'saga pl');

	const customIndicatorReqObj = yield select(getCustomIndicatorReqObj, payload.valueRow);
	console.log(customIndicatorReqObj, 'getCustomIndicatorReqObj');

	yield fetchCustomIndicators(customIndicatorReqObj, payload.valueRow);

	// yield put(doSetInputField({payload})); //not required --> async and triggered in reducer already
	// yield fetchAsync();
}

export function* onFieldChange() {
	console.log('called');
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
