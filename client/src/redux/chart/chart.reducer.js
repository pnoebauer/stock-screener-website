import {CUSTOM_INDICATORS} from '../../assets/constants';

import {ConfigurationTypes} from './chart.types';

const initialState = {
	indicators: [
		{
			type: 'ema',
			windowSize: 30,
			sourcePath: 'high',
			id: 0,
		},
		{
			type: 'sma',
			windowSize: 5,
			sourcePath: 'close',
			id: 1,
		},
	],
};

const chartReducer = (state = initialState, action) => {
	switch (action.type) {
		// case ConfigurationTypes.SET_CHART_INDICATOR_CONFIGURATION:
		// 	return applySetIndicatorConfiguration(state, action);
		default:
			return state;
	}
};

const applySetIndicatorConfiguration = (state, action) => {
	const indicatorConfigurationObject = action.payload;
	const indicator = Object.keys(indicatorConfigurationObject)[0];
	const indicatorConfiguration = indicatorConfigurationObject[indicator];

	return {
		...state,
		[indicator]: indicatorConfiguration,
	};
};

export default chartReducer;
