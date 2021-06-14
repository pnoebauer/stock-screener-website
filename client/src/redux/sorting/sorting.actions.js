import {SortingTypes} from './sorting.types';

export const doSetSortingConfiguration = payload => ({
	type: SortingTypes.SET_SORTING_CONFIGURATION,
	payload,
});

export const doClearSortingConfiguration = () => ({
	type: SortingTypes.CLEAR_SORTING_CONFIGURATION,
});
