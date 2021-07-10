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
		{
			type: 'sma',
			windowSize: 15,
			sourcePath: 'close',
			id: 2,
		},
	],
};

const chartReducer = (state = initialState, action) => {
	// console.log({action});
	switch (action.type) {
		case ConfigurationTypes.SET_CHART_INDICATOR_CONFIGURATION:
			return applySetChartIndicatorConfiguration(state, action);
		default:
			return state;
	}
};

const applySetChartIndicatorConfiguration = (state, action) => {
	const indicatorConfigurationObject = action.payload;
	// console.log({indicatorConfigurationObject}, '--------');
	const {id} = indicatorConfigurationObject;

	return {
		...state,
		indicators: state.indicators.map(indicator => {
			if (indicator.id === id) {
				return indicatorConfigurationObject;
				// return {
				// 	...indicator,
				// 	...indicatorConfigurationObject,
				// };
			}
			return indicator;
		}),
	};
};

export default chartReducer;
