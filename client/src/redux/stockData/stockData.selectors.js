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

const getStockData = state => state.stockData;

export const getColumn = createCachedSelector(
	getStockData,
	(state, columnName) => columnName,
	(stockData, columnName) => stockData[columnName] ?? 0
)((state, columnName) => columnName);

export const getField = createCachedSelector(
	getColumn,
	(state, headerName, index) => index,
	(columnData, index) =>
		console.log(columnData, index, 'run getField') || (columnData[index] ?? 0)
)({keySelector: (state, headerName, index) => `${headerName}:${index}`});
