import {ConfigurationTypes} from './configuration.types';

export const doSetIndicatorConfiguration = payload => ({
	type: ConfigurationTypes.SET_INDICATOR_CONFIGURATION,
	payload,
});
