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
		console.log(sortingConfiguration, stockData, 'sm');
		return stockData;
	}
)({
	keySelector: state =>
		`${state.sortingConfiguration.sortedField}:${state.sortingConfiguration.direction}`,
	selectorCreator: createDeepEqualSelector,
});
