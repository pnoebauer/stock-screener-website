import {ConfigurationTypes} from './chart.types';

export const doSetChartIndicatorConfiguration = payload => ({
	type: ConfigurationTypes.SET_CHART_INDICATOR_CONFIGURATION,
	payload,
});
