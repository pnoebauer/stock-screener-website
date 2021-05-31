import {createSelector} from 'reselect';
import {createCachedSelector} from 're-reselect';
import {createSelectorCreator, defaultMemoize} from 'reselect';
import isEqual from 'lodash.isequal';

// create a "selector creator" that uses lodash.isequal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const getSortingConfiguration = state => state.sortingConfiguration;
const getStockData = state => state.stockData;

export const getSortingMap = createCachedSelector(
	getSortingConfiguration,
	getStockData,
	(sortingConfiguration, stockData) => {
		// const sortedIdMap = sortData(sortingConfiguration, stockData);
		// console.log(sortingConfiguration, stockData, 'sm', sortedIdMap);

		const sortingMap = sortData(sortingConfiguration, stockData);
		console.log(sortingConfiguration, stockData, 'sm', sortingMap);

		return sortingMap;
	}
)({
	keySelector: state =>
		`${state.sortingConfiguration.sortedField}:${state.sortingConfiguration.direction}`,
	selectorCreator: createDeepEqualSelector,
});

const sortData = (sortingConfiguration, stockData) => {
	const {sortedField, direction} = sortingConfiguration;
	// const ids = [...stockData.ID];
	// let idMap = {};

	// let sortMap = {};

	const sortColumnValues = [...stockData[sortedField]];

	if (!sortColumnValues.length) return;

	// temporary array holds objects with value and index
	const mapped = sortColumnValues.map((value, index) => {
		// strings have to be lower case
		if (typeof value === 'string') {
			value = value.toLowerCase();
		}
		// the id field needs to be of type Number
		if (sortedField === 'ID') {
			value = Number(value);
		}

		return {
			index,
			value,
			// id: ids[index],
		};
	});

	// sorting the mapped array containing the reduced values
	mapped.sort((a, b) => {
		// console.log(a, b, 'a');
		if (a.value > b.value) {
			// console.log('>');
			return direction;
		}
		if (a.value < b.value) {
			// console.log('<');
			return -direction;
		}
		return 0;
	});
	console.log(mapped, 'map sort');

	// mapped.forEach((element, index) => {
	// 	console.log(element.id, index, 'id', 'index');
	// 	idMap[element.id] = index;
	// });

	// return idMap;

	return mapped.map(item => item.index);
};

// sortTable = (tableObject, sortedField, direction) => {

// 	// console.log(idMap, 'idMap', stateClone.ID, 'ids');
// 	// const key = `${sortedField} ${direction}`;

// 	// add the sortedTable to the 'sortedTable' local storage item with a key denoting the configuration
// 	const sortedTable = {...retrievedObject, [currentKey]: idMap};
// 	// console.log(sortedTable, 'sortedTable');

// 	// table headers (Symbol, Interval, Price, ...)
// 	const columnHeaders = Object.keys(stateClone);
// 	// loop over each header and re-sort its rows based on idMap
// 	columnHeaders.forEach(column => {
// 		let reord = [];
// 		stateClone[column].forEach((element, index) => {
// 			const id = ids[index];

// 			// console.log(id, idMap[id]);
// 			const reorderedPosition = idMap[id];
// 			reord[reorderedPosition] = element;
// 		});
// 		stateClone[column] = reord;
// 		// console.log(reord);
// 	});

// 	return stateClone;
// };
