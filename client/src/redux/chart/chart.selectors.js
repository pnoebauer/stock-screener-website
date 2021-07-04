// import {createCachedSelector} from 're-reselect';

// const getConfiguration = state => state.indicatorConfiguration;

// export const getIndicatorConfiguration = createCachedSelector(
// 	getConfiguration,
// 	(state, indicator) => indicator,
// 	(configuration, indicator) =>
// 		console.log(configuration, indicator, 'run') || configuration[indicator]
// )((state, indicator) => indicator);

import {createCachedSelector} from 're-reselect';
import {createSelectorCreator, defaultMemoize} from 'reselect';
import isEqual from 'lodash.isequal';

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const getChartConfiguration = state => state.chartConfiguration;

export const getChartIndicatorConfiguration = createCachedSelector(
	getChartConfiguration,
	(state, indicatorId) => indicatorId,
	(configuration, indicatorId) => {
		const {indicators} = configuration;
		console.log(indicators, 'indicators');
		for (let i = 0; i < indicators.length; i++) {
			const {id} = indicators[i];
			console.log(indicators[i], 'indicators[i]');
			if (id === indicatorId) {
				console.log(id, indicatorId, 'id === indicatorId');
				return indicators[i];
			}
		}

		// // console.log(configuration, indicator, 'run') ||
		// configuration[indicator]
	}
)({
	keySelector: (state, indicatorId) => indicatorId,
	selectorCreator: createDeepEqualSelector,
});

// export const getIndicatorConfiguration = createCachedSelector(
// 	getConfiguration,
// 	(state, indicator) => indicator,
// 	(configuration, indicator) =>
// 		// console.log(configuration, indicator, 'run') ||
// 		configuration[indicator]
// )({
// 	keySelector: (state, indicator) => indicator,
// 	selectorCreator: createDeepEqualSelector,
// });
