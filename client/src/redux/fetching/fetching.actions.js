import {FetchingTypes} from './fetching.types';

export const doSetFetchStart = () => ({
	type: FetchingTypes.FETCH_START,
});

export const doSetFetchSuccess = () => ({
	type: FetchingTypes.FETCH_SUCCESS,
});

export const doSetFetchFailure = () => ({
	type: FetchingTypes.FETCH_FAILURE,
});
