import {FilteringTypes} from './filtering.types';

export const doSetFilterRules = payload => ({
	type: FilteringTypes.SET_FILTER_RULES,
	payload,
});
