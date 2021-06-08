import {INDICATORS_TO_API, CUSTOM_INDICATORS, SYMBOLS} from '../../assets/constants';

import {createSelector} from 'reselect';

import {createCachedSelector} from 're-reselect';

import {createSelectorCreator, defaultMemoize} from 'reselect';

import isEqual from 'lodash.isequal';

import {getIndicatorConfiguration} from '../configuration/configuration.selectors';
import {getFilteredData} from '../filtering/filtering.selectors';

const availableIndicators = [
	...Object.keys(INDICATORS_TO_API),
	...Object.keys(CUSTOM_INDICATORS),
];

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const getStockData = state => state.stockData;

// export const getStockNumber = state => state.stockData.Symbol.length;
export const getStockNumber = createSelector(
	getStockData,
	stockData => stockData.Symbol.length
);
// export const stockNumber = stockData => stockData.Symbol.length;
// export const getStockNumber = createSelector(getStockData, stockNumber);

// export const getColumnNames = createDeepEqualSelector(getStockData, stockData =>
// 	Object.keys(stockData)
// );

export const getColumnNames = createDeepEqualSelector(getStockData, stockData =>
	Object.keys(stockData).filter(keyName => keyName !== 'ID')
);

export const getNonCustomIndicators = createDeepEqualSelector(
	getColumnNames,
	columnNames =>
		columnNames.filter(columnName => Object.keys(INDICATORS_TO_API).includes(columnName))
);

export const getCustomIndicators = createDeepEqualSelector(getColumnNames, columnNames =>
	columnNames.filter(columnName => Object.keys(CUSTOM_INDICATORS).includes(columnName))
);

export const getUsedIndicators = createDeepEqualSelector(
	getColumnNames,
	columnNames =>
		columnNames.filter(columnName => availableIndicators.includes(columnName)) //only return those that exist in the indicator list (Symbol, interval, etc. to be excluded)
	// columnNames => availableIndicators.filter(indicator => columnNames.includes(indicator)) //alternatively
);

export const getUnusedIndicators = createDeepEqualSelector(
	getColumnNames,
	columnNames => availableIndicators.filter(indicator => !columnNames.includes(indicator)) //only return what is not under the table headers (columns) already
);

export const getColumn = createCachedSelector(
	getStockData,
	(state, columnName) => columnName,
	(stockData, columnName) => stockData[columnName] ?? 0
)((state, columnName) => columnName);

export const getRowValues = createCachedSelector(
	getStockData,
	// getFilteredData,
	(state, rowIdx) => rowIdx,
	(stockData, rowIdx) => {
		const rowVal = Object.keys(stockData).flatMap(columnName =>
			columnName !== 'ID' ? [stockData[columnName][rowIdx] ?? '...'] : []
		);

		// console.log(rowVal, 'rowVal', Object.keys(stockData));
		return rowVal;
	}
)((state, rowIdx) => rowIdx);

// export const getRowSetValues = createCachedSelector(getRowValues, rowValues =>
// 	rowValues.slice(0, 2)
// )((state, rowIdx) => rowIdx);

export const getAllCustomIndicatorsConfig = createDeepEqualSelector(
	state => state,
	getCustomIndicators,
	(state, customIndicators) => {
		let indicators = {};
		customIndicators.forEach(indicator => {
			const config = getIndicatorConfiguration(state, indicator);
			indicators[indicator.toLowerCase()] = config;
		});

		return indicators;
	}
);

export const getCustomIndicatorReqObj = createCachedSelector(
	getStockData,
	(state, rowIdx) => rowIdx,
	// (state, rowIdx) => {
	// 	const customIndicators = getCustomIndicators(state);
	// 	let indicators = {};
	// 	customIndicators.forEach(indicator => {
	// 		const config = getIndicatorConfiguration(state, indicator);
	// 		indicators[indicator.toLowerCase()] = config;
	// 	});

	// 	return indicators;
	// },
	getAllCustomIndicatorsConfig,
	(stockData, rowIdx, indicators) => {
		const symbol = stockData.Symbol[rowIdx];
		const interval = stockData.Interval[rowIdx];

		const requestObj = {
			symbol,
			interval,
			indicators,
		};
		return requestObj;
	}
)({
	keySelector: (state, rowIdx) => rowIdx,
	selectorCreator: createDeepEqualSelector,
});

// createDeepEqualSelector --> selector won't recalculate if the exact same value is selected in the dropdown as before
export const getField = createCachedSelector(
	getColumn,
	(state, headerName, index) => index,
	(columnData, index) => {
		// add row input has no data in the main stockData state object
		// use the stock symbol with that row index as a default value
		if (index >= columnData.length) {
			return SYMBOLS[index];
		}
		return columnData[index] ?? 0;
	}
)({
	keySelector: (state, headerName, index) => `${headerName}:${index}`,
	selectorCreator: createDeepEqualSelector,
});
