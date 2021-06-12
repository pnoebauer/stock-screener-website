import {createSelector} from 'reselect';

import {createCachedSelector} from 're-reselect';

import {createSelectorCreator, defaultMemoize} from 'reselect';

import isEqual from 'lodash.isequal';

import {getStockData, getStockNumber} from './stockData.selectors';
import {getFilteredData, getFilteredSymbolList} from '../filtering/filtering.selectors';

import {UNIVERSES} from '../../assets/constants';

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const getStocksPerUniverseCount = createDeepEqualSelector(
	getStockData,
	stockData => {
		let stocksPerUniverseCount = {};

		Object.keys(UNIVERSES).forEach(universe => {
			let count = 0;
			for (const stock of stockData.Symbol) {
				if (UNIVERSES[universe].includes(stock)) {
					count++;
				}
			}
			stocksPerUniverseCount[universe] = count;
		});

		return stocksPerUniverseCount;
	}
);

export const getStocksPerUniverseFilteredCount = createDeepEqualSelector(
	getFilteredSymbolList,
	filteredSymbolList => {
		let stocksPerUniverseCount = {};

		Object.keys(UNIVERSES).forEach(universe => {
			let count = 0;
			for (const stock of filteredSymbolList) {
				if (UNIVERSES[universe].includes(stock)) {
					count++;
				}
			}
			stocksPerUniverseCount[universe] = count;
		});

		return stocksPerUniverseCount;
	}
);
