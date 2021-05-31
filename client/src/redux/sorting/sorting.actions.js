import {SortingTypes} from './sorting.types';

export const doSetSortingConfiguration = payload => ({
	type: SortingTypes.SET_SORTING_CONFIGURATION,
	payload,
});
