import {takeLatest, call, put, select, all} from 'redux-saga/effects';

import {StockDataTypes} from './stockData.types';

import {ConfigurationTypes} from '../configuration/configuration.types';

import {
	getCustomIndicatorReqObj,
	getStockNumber,
	getAllCustomIndicatorsConfig,
} from './stockData.selectors';

import {doSetRow, doSetRows} from './stockData.actions';

import {
	doSetFetchStart,
	doSetFetchSuccess,
	doSetFetchFailure,
} from '../fetching/fetching.actions';

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
		// yield put(doSetRow(payload));
		return payload;
	} catch (error) {
		yield put(doSetFetchFailure(error.message));
	}
}

export function* updateRow({payload}) {
	const {valueRow} = payload;

	const customIndicatorReqObj = yield select(getCustomIndicatorReqObj, valueRow);

	if (!Object.keys(customIndicatorReqObj.indicators).length) {
		return;
	}

	yield put(doSetFetchStart());
	const fetchedData = yield fetchCustomIndicators(customIndicatorReqObj, valueRow);

	// yield put(doSetRow(fetchedData));

	yield all([put(doSetFetchSuccess()), put(doSetRow(fetchedData))]);
}

export function* updateIndicatorRows(startRow, endRow) {
	const customIndicatorConfigs = yield select(getAllCustomIndicatorsConfig);

	if (!Object.keys(customIndicatorConfigs).length) return;

	yield put(doSetFetchStart());

	let fetchedData = [];
	for (let valueRow = startRow; valueRow < endRow; valueRow++) {
		const customIndicatorReqObj = yield select(getCustomIndicatorReqObj, valueRow);

		const fetchedDataRow = yield fetchCustomIndicators(customIndicatorReqObj, valueRow);
		fetchedData.push(fetchedDataRow);
	}

	// yield put(doSetRows(fetchedData));

	yield all([put(doSetFetchSuccess()), put(doSetRows(fetchedData))]);
}
export function* updateAllIndicatorRows() {
	const numberStocks = yield select(getStockNumber);

	yield updateIndicatorRows(0, numberStocks);
}

export function* updateAddedIndicatorRows({payload}) {
	const {stockNumber} = payload;
	const numberStocks = yield select(getStockNumber);

	// update from the priorly highest stock number to the current number of stocks (including the ones that were added with this action)
	yield updateIndicatorRows(stockNumber, numberStocks);
}

export function* onColumnChange() {
	yield takeLatest(
		[StockDataTypes.SET_COLUMNS, ConfigurationTypes.SET_INDICATOR_CONFIGURATION],
		updateAllIndicatorRows
	);
}

export function* onFieldChange() {
	yield takeLatest([StockDataTypes.SET_INPUT_FIELD, StockDataTypes.ADD_ROW], updateRow);
}

export function* onIntervalsChange() {
	yield takeLatest(StockDataTypes.SET_ALL_INTERVALS, updateAllIndicatorRows);
}

export function* onUniverseAdd() {
	yield takeLatest(StockDataTypes.ADD_UNIVERSE, updateAddedIndicatorRows);
}

export function* onDailyUpdate() {
	yield takeLatest(StockDataTypes.DAILY_UPDATE, updateAllIndicatorRows);
}

export function* stockDataSagas() {
	yield all([
		call(onFieldChange),
		call(onColumnChange),
		call(onIntervalsChange),
		call(onUniverseAdd),
		call(onDailyUpdate),
	]);
}
