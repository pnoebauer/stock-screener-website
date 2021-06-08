import {createSelector} from 'reselect';
import {createCachedSelector} from 're-reselect';
import {createSelectorCreator, defaultMemoize} from 'reselect';
import isEqual from 'lodash.isequal';

import {getFilteredData} from '../filtering/filtering.selectors';

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const getSortingConfiguration = state => state.sortingConfiguration;
const getStockData = state => state.stockData;

export const getSortingMap = createCachedSelector(
	getSortingConfiguration,
	getStockData,
	// getFilteredData,
	(sortingConfiguration, stockData) => {
		// console.log('stockdata', stockData);
		const sortingMap = sortData(sortingConfiguration, stockData);

		return sortingMap;
	}
)({
	keySelector: state =>
		`${state.sortingConfiguration.sortedField}:${state.sortingConfiguration.direction}`,
	selectorCreator: createDeepEqualSelector,
});

const sortData = (sortingConfiguration, stockData) => {
	const {sortedField, direction} = sortingConfiguration;

	const sortColumnValues = [...stockData[sortedField]];

	if (!sortColumnValues.length) return;

	// temporary array holds objects with value and index
	const mapped = sortColumnValues.map((value, index) => {
		// strings have to be lower case
		if (typeof value === 'string') {
			value = value.toLowerCase();
		}
		// the id field needs to be of type Number
		if (sortedField === 'ID') {
			value = Number(value);
		}

		return {
			index,
			value,
		};
	});

	// sorting the mapped array containing the reduced values
	mapped.sort((a, b) => {
		if (a.value > b.value) {
			return direction;
		}
		if (a.value < b.value) {
			return -direction;
		}
		return 0;
	});

	return mapped.map(item => item.index);
};
