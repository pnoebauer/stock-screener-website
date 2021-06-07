import {takeLatest, call, put, select, all} from 'redux-saga/effects'; //listens to every actions of a specific type that is passed to it

import {StockDataTypes} from './stockData.types';
import {
	getCustomIndicatorReqObj,
	getStockNumber,
	getAllCustomIndicatorsConfig,
} from './stockData.selectors';

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
		// console.log(data, 'data');

		const payload = {data, rowIndex};
		// console.log('saga row set');
		yield put(doSetRow(payload));

		// check that sorting selector works correctly once the data has been updated

		// yield put(fetchSuccess()); //put saga's equivalent to dispatch
	} catch (error) {
		// yield put(fetchFailure(error.message));
	}
}

export function* updateRow({payload}) {
	const {valueRow} = payload;

	const customIndicatorReqObj = yield select(getCustomIndicatorReqObj, valueRow);

	// console.log(customIndicatorReqObj, 'getCustomIndicatorReqObj');

	if (!Object.keys(customIndicatorReqObj.indicators).length) {
		// console.log('empty');
		return;
	}

	yield fetchCustomIndicators(customIndicatorReqObj, valueRow);

	// yield put(doSetInputField({payload})); //not required --> async and triggered in reducer already
	// yield fetchAsync();
}

export function* updateAllIndicatorRows({payload}) {
	// const {columnNames}=payload

	const numberStocks = yield select(getStockNumber);
	const customIndicatorConfigs = yield select(getAllCustomIndicatorsConfig);

	if (!Object.keys(customIndicatorConfigs).length) return;

	for (let valueRow = 0; valueRow < numberStocks; valueRow++) {
		const customIndicatorReqObj = yield select(getCustomIndicatorReqObj, valueRow);
		// console.log(customIndicatorReqObj, 'getCustomIndicatorReqObj');

		// if (!Object.keys(customIndicatorReqObj.indicators).length) {
		// 	// console.log('empty');
		// 	continue;
		// }

		yield fetchCustomIndicators(customIndicatorReqObj, valueRow);
	}
}

export function* updateAddedIndicatorRows({payload}) {
	const {stockNumber} = payload;

	const numberStocks = yield select(getStockNumber);
	const customIndicatorConfigs = yield select(getAllCustomIndicatorsConfig);

	if (!Object.keys(customIndicatorConfigs).length) return;

	for (let valueRow = stockNumber; valueRow < numberStocks; valueRow++) {
		const customIndicatorReqObj = yield select(getCustomIndicatorReqObj, valueRow);
		// console.log(customIndicatorReqObj, 'getCustomIndicatorReqObj');

		// if (!Object.keys(customIndicatorReqObj.indicators).length) {
		// 	// console.log('empty');
		// 	continue;
		// }

		yield fetchCustomIndicators(customIndicatorReqObj, valueRow);
	}
}

export function* onColumnChange() {
	yield takeLatest(StockDataTypes.SET_COLUMNS, updateAllIndicatorRows);
}

export function* onFieldChange() {
	// yield takeLatest(StockDataTypes.SET_INPUT_FIELD, updateRow);
	yield takeLatest([StockDataTypes.SET_INPUT_FIELD, StockDataTypes.ADD_ROW], updateRow);
}

export function* onIntervalsChange() {
	yield takeLatest(StockDataTypes.SET_ALL_INTERVALS, updateAllIndicatorRows);
}

export function* onUniverseAdd() {
	yield takeLatest(StockDataTypes.ADD_UNIVERSE, updateAddedIndicatorRows);
}

export function* stockDataSagas() {
	yield all([
		call(onFieldChange),
		call(onColumnChange),
		call(onIntervalsChange),
		call(onUniverseAdd),
	]);
	// yield all([call(asyncStart)]);
}

// // always start fetching if any of below action happens
// export function* asyncStart() {
// 	yield takeLatest(
// 		[StockDataTypes.SET_INPUT_FIELD, StockDataTypes.SET_COLUMNS],
// 		fetchAsync
// 	);
// }
