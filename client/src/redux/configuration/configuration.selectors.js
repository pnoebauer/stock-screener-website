import {createCachedSelector} from 're-reselect';

const getConfiguration = state => state.configuration;

export const getIndicatorConfiguration = createCachedSelector(
	getConfiguration,
	(state, indicator) => indicator,
	(configuration, indicator) => configuration[indicator]
)((state, indicator) => indicator);
