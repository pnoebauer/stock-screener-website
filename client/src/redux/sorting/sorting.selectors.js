// // import {createCachedSelector} from 're-reselect';

// // const getConfiguration = state => state.configuration;

// // export const getIndicatorConfiguration = createCachedSelector(
// // 	getConfiguration,
// // 	(state, indicator) => indicator,
// // 	(configuration, indicator) =>
// // 		console.log(configuration, indicator, 'run') || configuration[indicator]
// // )((state, indicator) => indicator);

// import {createCachedSelector} from 're-reselect';
// import {createSelectorCreator, defaultMemoize} from 'reselect';
// import isEqual from 'lodash.isequal';

// // create a "selector creator" that uses lodash.isequal instead of ===
// const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

// const getConfiguration = state => state.configuration;

// export const getIndicatorConfiguration = createCachedSelector(
// 	getConfiguration,
// 	(_, indicator) => indicator,
// 	(configuration, indicator) =>
// 		console.log(configuration, indicator, 'run') || configuration[indicator]
// )({
// 	keySelector: (_, indicator) => indicator,
// 	selectorCreator: createDeepEqualSelector,
// });
