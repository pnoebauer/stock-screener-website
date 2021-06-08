import {FetchingTypes} from './fetching.types';

const initialState = {
	pending: false,
	error: '',
};

const fetchingReducer = (state = initialState, action) => {
	switch (action.type) {
		case FetchingTypes.FETCH_START:
			return {
				pending: true,
				error: '',
			};
		case FetchingTypes.FETCH_SUCCESS:
			return {
				pending: false,
				error: '',
			};
		case FetchingTypes.FETCH_FAILURE:
			return {
				pending: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

export default fetchingReducer;
