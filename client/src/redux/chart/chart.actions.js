import {ConfigurationTypes} from './chart.types';

export const doSetChartIndicatorConfiguration = payload => ({
	type: ConfigurationTypes.SET_CHART_INDICATOR_CONFIGURATION,
	payload,
});

export const doSetIndicators = payload => ({
	type: ConfigurationTypes.SET_CHART_INDICATORS,
	payload,
});
