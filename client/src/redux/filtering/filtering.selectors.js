import {createSelector} from 'reselect';
import {createCachedSelector} from 're-reselect';
import {createSelectorCreator, defaultMemoize} from 'reselect';
import isEqual from 'lodash.isequal';

import {getSortingMap} from '../sorting/sorting.selectors';

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const operatorFunction = {
	'=': (a, b) => a === b,
	'>': (a, b) => a > b,
	'>=': (a, b) => a >= b,
	'<': (a, b) => a < b,
	'<=': (a, b) => a <= b,
};

const getStockData = state => state.stockData;
export const getFilterRules = state => state.filterRules;
export const getFilterRulesNumber = state => state.filterRules.length;

export const getFilteredData = createDeepEqualSelector(
	getFilterRules,
	getStockData,
	(filterRules, stockData) => {
		// const filteredData = filterData(filterRules, stockData);
		const filteredData = filteredIndexMap(filterRules, stockData);
		return filteredData;
	}
);

export const getFilteredSymbolList = createDeepEqualSelector(
	getFilteredData,
	getStockData,
	(filteredDataIndices, stockData) => {
		const filteredSymbolList = filteredDataIndices.map(
			filteredIndex => stockData.Symbol[filteredIndex]
		);
		// console.log(filteredSymbolList, 'fs');
		return filteredSymbolList;
	}
);

const filteredIndexMap = (rules, data) => {
	let filterMap = [];

	if (!rules.length) {
		filterMap = Array(data.Symbol.length)
			.fill()
			.map((v, i) => i);
		// console.log('no rule', filterMap);
		return filterMap;
	}

	// console.log(rules, 'rul', data.Symbol);

	data.Symbol.forEach((value, index) => {
		// console.log('symbol', value, index);
		let pass = true;
		for (let i = 0; i < rules.length; i++) {
			const rule = rules[i];
			const {operator, indicatorLH, indicatorRH} = rule;

			// console.log(operator, indicatorLH, indicatorRH, 'rule');

			// if the selected indicators do not exist in the table then do not filter that row
			if (!data[indicatorLH] && !data[indicatorRH]) {
				pass = true;
				break;
			}

			// console.log(data[indicatorLH][index], data[indicatorRH][index], 'data');

			if (
				!operatorFunction[operator](data[indicatorLH][index], data[indicatorRH][index])
			) {
				// console.log('fail');
				pass = false;
				break;
			}
		}

		if (pass) {
			filterMap.push(index);

			// console.log('pass', index, filterMap);
		}
	});

	return filterMap;
};

const filterData = (rules, data) => {
	let filteredObject = {};

	if (rules.length && data) {
		Object.keys(data).forEach(indicator => {
			filteredObject[indicator] = data[indicator].filter((value, index) => {
				let pass = true;
				for (let i = 0; i < rules.length; i++) {
					const rule = rules[i];
					const {operator, indicatorLH, indicatorRH} = rule;
					// if the selected indicators do not exist in the table then do not filter that row
					if (!data[indicatorLH] && !data[indicatorRH]) {
						return true;
					}
					if (
						!operatorFunction[operator](
							data[indicatorLH][index],
							data[indicatorRH][index]
						)
					) {
						pass = false;
						break;
					}
				}
				return pass;
			});
		});
		// console.log('filter', filteredObject);
		return filteredObject;
	}
	return data;
};

// export const getFilteredStockNumber = createSelector(
// 	// getFilteredData,
// 	state => state.stockData,
// 	stockData => stockData.Symbol.length
// );

export const getFilteredStockNumber = createSelector(
	getFilteredData,
	filteredData => filteredData.length
);

export const getFilteredSortingMap = createDeepEqualSelector(
	getFilteredData,
	getSortingMap,
	(filteredDataIndices, sortingMap) => {
		if (!(filteredDataIndices && sortingMap)) {
			return [];
		}

		const filteredSortingMap = sortingMap.filter(value =>
			filteredDataIndices.includes(value)
		);

		return filteredSortingMap;
	}
);
