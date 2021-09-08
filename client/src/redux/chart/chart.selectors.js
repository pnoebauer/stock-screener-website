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

// import {MAIN_CHART_INDICATORS, CHART_INDICATORS} from '../../assets/constants';
import {CHART_INDICATORS} from '../../assets/constants';

const availableIndicators = Object.keys(CHART_INDICATORS);

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const getChartConfiguration = state => state.chartConfiguration;

// export const getChartIndicatorConfigs = state => state.chartConfiguration.indicators;

export const getChartIndicatorConfigs = createDeepEqualSelector(
	getChartConfiguration,
	chartConfiguration => chartConfiguration.indicators
);

export const getUsedIndicators = createDeepEqualSelector(
	getChartIndicatorConfigs,
	indicatorConfigsList => indicatorConfigsList.map(({type}) => type)
);

// export const getUnusedIndicators = createDeepEqualSelector(
// 	getUsedIndicators,
// 	usedIndicators =>
// 		availableIndicators.filter(indicator => !usedIndicators.includes(indicator))
// );

// allow duplicates
export const getUnusedIndicators = () => availableIndicators;

// export const getMainChartIndicatorList = createDeepEqualSelector(
// 	getChartIndicatorConfigs,
// 	indicatorConfigsList =>
// 		indicatorConfigsList.flatMap(indicatorObj =>
// 			MAIN_CHART_INDICATORS.includes(indicatorObj.type.toLowerCase())
// 				? [indicatorObj.type]
// 				: []
// 		)
// );

// export const getSubChartIndicatorList = createDeepEqualSelector(
// 	getChartIndicatorConfigs,
// 	indicatorConfigsList =>
// 		indicatorConfigsList.flatMap(indicatorObj =>
// 			MAIN_CHART_INDICATORS.includes(indicatorObj.type.toLowerCase())
// 				? []
// 				: [indicatorObj.type]
// 		)
// );

export const getChartIndicatorConfiguration = createCachedSelector(
	// getChartConfiguration,
	getChartIndicatorConfigs,
	(state, indicatorId) => indicatorId,
	// (configuration, indicatorId) => {
	(indicators, indicatorId) => {
		// const {indicators} = configuration;
		// console.log(indicators, 'indicators');
		for (let i = 0; i < indicators.length; i++) {
			const {id} = indicators[i];
			// console.log(indicators[i], 'indicators[i]');
			if (id === indicatorId) {
				// console.log(id, indicatorId, 'id === indicatorId');
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
