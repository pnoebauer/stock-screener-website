import {SortingTypes} from './sorting.types';

const initialState = {
	sortedField: 'ID',
	direction: 1,
};

const sortingReducer = (state = initialState, action) => {
	switch (action.type) {
		case SortingTypes.SET_SORTING_CONFIGURATION:
			return applySetSortingConfiguration(state, action);
		default:
			return state;
	}
};

const applySetSortingConfiguration = (state, action) => {
	let sortedField = action.payload;
	let direction = 1;

	if (state.sortedField === sortedField) {
		// if the direction is already up, then change it to down
		if (state.direction === direction) {
			direction = -1;
			// if the direction is already down, then change it to neutral and sort based on ID (=reset table)
		} else if (state.direction === -direction) {
			// direction = 0;
			// direction = 1;
			sortedField = 'ID';
		}
	}

	return {
		sortedField,
		direction,
	};
};

export default sortingReducer;
