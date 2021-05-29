import {CUSTOM_INDICATORS} from '../../assets/constants';

import {ConfigurationTypes} from './configuration.types';

const initialState = {
	...CUSTOM_INDICATORS,
};

const configurationReducer = (state = initialState, action) => {
	switch (action.type) {
		case ConfigurationTypes.SET_INDICATOR_CONFIGURATION:
			return applySetIndicatorConfiguration(state, action);
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

export default configurationReducer;
