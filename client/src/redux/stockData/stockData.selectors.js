import {createSelector} from 'reselect';

// const selectStockData = state => state.stockData;
// export const selectField = location =>
// 	createSelector(
// 		[selectStockData],
// 		stockData =>
// 			(stockData[location.headerName] &&
// 				stockData[location.headerName][location.index]) ??
// 			0
// 	);

import {createCachedSelector} from 're-reselect';

import {createSelectorCreator, defaultMemoize} from 'reselect';
import isEqual from 'lodash.isequal';

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const getStockData = state => state.stockData;

export const getColumn = createCachedSelector(
	getStockData,
	(state, columnName) => columnName,
	(stockData, columnName) => stockData[columnName] ?? 0
)((state, columnName) => columnName);

export const getRowValues = createCachedSelector(
	getStockData,
	(state, rowIdx) => rowIdx,
	(stockData, rowIdx) =>
		Object.keys(stockData).map(columnName => stockData[columnName][rowIdx] ?? '...')
)((state, rowIdx) => rowIdx);

// createDeepEqualSelector --> selector won't recalculate if the exact same value is selected in the dropdown as before
export const getField = createCachedSelector(
	getColumn,
	(state, headerName, index) => index,
	(columnData, index) =>
		// console.log(columnData, index, 'run getField') ||
		columnData[index] ?? 0
)({
	keySelector: (state, headerName, index) => `${headerName}:${index}`,
	selectorCreator: createDeepEqualSelector,
});
