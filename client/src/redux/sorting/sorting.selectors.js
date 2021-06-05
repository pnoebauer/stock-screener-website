import {createSelector} from 'reselect';
import {createCachedSelector} from 're-reselect';
import {createSelectorCreator, defaultMemoize} from 'reselect';
import isEqual from 'lodash.isequal';

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const getSortingConfiguration = state => state.sortingConfiguration;
const getStockData = state => state.stockData;

export const getSortingMap = createCachedSelector(
	getSortingConfiguration,
	getStockData,
	(sortingConfiguration, stockData) => {
		const sortingMap = sortData(sortingConfiguration, stockData);
		// console.log(sortingConfiguration, stockData, 'sm', sortingMap);

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
