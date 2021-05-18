import React from 'react';

function withSorting(WrappedComponent) {
	class WithSorting extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				sortConfig: {},
			};
		}

		sortTable = (tableObject, sortedField, direction) => {
			// console.log(tableObject, sortedField, direction, 'sort');
			const stateClone = JSON.parse(JSON.stringify(tableObject));
			delete stateClone.sortConfig;

			const ids = [...stateClone.ID];

			// console.log(stateClone[sortedField], stateClone, sortedField, direction);

			const retrievedObject = JSON.parse(localStorage.getItem('sortedTable'));
			// console.log(retrievedObject, 'retrievedObject');

			const currentKey = `${sortedField} ${direction}`;
			// console.log(retrievedObject[currentKey], currentKey, 'key');

			let idMap = {};

			if (retrievedObject && retrievedObject[currentKey]) {
				// console.log('exists');

				idMap = retrievedObject[currentKey];
			} else {
				// console.log(sortedField, 'sortedField');
				const list = [...stateClone[sortedField]];
				// console.log(list, 'list', list.length, !list.length);

				if (!list.length) return;

				// temporary array holds objects with value and index
				const mapped = list.map((value, index) => {
					// strings have to be lower case
					if (typeof value === 'string') {
						value = value.toLowerCase();
					}
					// the id field needs to be of type Number
					if (sortedField === 'ID') {
						value = Number(value);
					}

					// console.log(sortedField, typeof value, value);

					return {
						index,
						value,
						id: ids[index],
					};
				});

				// sorting the mapped array containing the reduced values
				mapped.sort((a, b) => {
					if (a.value > b.value) {
						return direction;
					}
					if (a.value < b.value) {
						return -direction;
					}
					return 0;
				});
				// console.log(mapped, 'map sort');

				mapped.forEach((element, index) => (idMap[element.id] = index));
				// console.log(idMap, 'idMap', stateClone.ID, 'ids');
				// const key = `${sortedField} ${direction}`;

				const sortedTable = {...retrievedObject, [currentKey]: idMap};
				// console.log(sortedTable, 'sortedTable');

				localStorage.setItem('sortedTable', JSON.stringify(sortedTable));
			}

			// table headers (Symbol, Interval, Price, ...)
			const columnHeaders = Object.keys(stateClone);
			// loop over each header and re-sort its rows based on idMap
			columnHeaders.forEach(column => {
				let reord = [];
				stateClone[column].forEach((element, index) => {
					const id = ids[index];

					// console.log(id, idMap[id]);
					const reorderedPosition = idMap[id];
					reord[reorderedPosition] = element;
				});
				stateClone[column] = reord;
				// console.log(reord);
			});

			return stateClone;
		};

		onSort = (sortedField, state) => {
			// console.log('click', sortedField, state);
			// onSort = (event, state) => {
			const {sortConfig} = this.state;
			// console.log('click', event.target.id, state);

			// let sortedField = event.target.id;
			// let sortedField = event.currentTarget.id;
			// // const list = [...this.state[sortedField]]

			let direction = 1;

			if (sortConfig.sortedField === sortedField) {
				// if the direction is already up, then change it to down
				if (sortConfig.direction === direction) {
					direction = -1;
					// if the direction is already down, then change it to neutral and sort based on ID (=reset table)
				} else if (sortConfig.direction === -direction) {
					// direction = 0;
					// direction = 1;
					sortedField = 'ID';
				}
			}

			// console.log(sortedField, direction, 'config');

			const sortedData = this.sortTable(state, sortedField, direction);

			// console.log('sortedData', sortedData);
			// this.setState(sortedData);

			this.setState({
				sortConfig: {
					sortedField,
					direction,
				},
			});

			return sortedData;
		};

		render() {
			return (
				<WrappedComponent
					onSort={this.onSort}
					sortTable={this.sortTable}
					{...this.state}
					{...this.props}
				/>
			);
		}
	}
	return WithSorting;
}

export default withSorting;

// import React from 'react';

// function withSorting(WrappedComponent) {
// 	class WithSorting extends React.Component {
// 		constructor(props) {
// 			super(props);
// 			this.state = {
// 				sortConfig: {},
// 			};
// 		}

// 		sortTable = (tableObject, sortedField, direction) => {
// 			// console.log('sort')

// 			const stateClone = JSON.parse(JSON.stringify(tableObject));

// 			delete stateClone.sortConfig;

// 			// console.log(stateClone,'stateClone orig');
// 			console.log(
// 				stateClone[sortedField],
// 				stateClone,
// 				sortedField,
// 				direction,
// 				'stateClone[sortedField]'
// 			);

// 			const list = [...stateClone[sortedField]];

// 			const ids = [...stateClone.ID];

// 			console.log(list, 'list');

// 			// temporary array holds objects with value and index
// 			const mapped = list.map((value, index) => {
// 				// strings have to be lower case
// 				if (typeof value === 'string') {
// 					value = value.toLowerCase();
// 				}
// 				// the id field needs to be of type Number
// 				if (sortedField === 'ID') {
// 					value = Number(value);
// 				}

// 				return {
// 					index,
// 					value,
// 					id: ids[index],
// 				};
// 			});

// 			// console.log(mapped, 'mapped');

// 			// sorting the mapped array containing the reduced values
// 			mapped.sort((a, b) => {
// 				if (a.value > b.value) {
// 					return direction;
// 				}
// 				if (a.value < b.value) {
// 					return -direction;
// 				}
// 				return 0;
// 			});

// 			console.log(mapped, 'map sort');

// 			let idMap = {};
// 			mapped.forEach((element, index) => (idMap[element.id] = index));

// 			console.log(idMap, 'idMap', stateClone.ID, 'ids');

// 			const retrievedObject = JSON.parse(localStorage.getItem('sortedTable'));
// 			console.log(retrievedObject, 'retrievedObject');

// 			const key = `${sortedField} ${direction}`;
// 			const sortedTable = {[key]: idMap};

// 			console.log(sortedTable, 'sortedTable');

// 			localStorage.setItem('sortedTable', JSON.stringify(sortedTable));

// 			// localStorage.setItem('testObject', JSON.stringify(testObject));
// 			// var retrievedObject = localStorage.getItem('testObject');
// 			// console.log('retrievedObject: ', JSON.parse(retrievedObject));

// 			// let idReord = [];
// 			// stateClone.ID.forEach((id, index) => {
// 			// 	console.log(id, idMap[id]);
// 			// 	const reorderedPosition = idMap[id];
// 			// 	idReord[reorderedPosition] = id;
// 			// });

// 			// console.log(idReord, 'idReord');

// 			// table headers (Symbol, Interval, Price, ...)
// 			const columnHeaders = Object.keys(stateClone);
// 			// loop over each header and re-sort its rows based on idMap
// 			columnHeaders.forEach(column => {
// 				let reord = [];
// 				stateClone[column].forEach((element, index) => {
// 					const id = ids[index];

// 					// console.log(id, idMap[id]);
// 					const reorderedPosition = idMap[id];
// 					reord[reorderedPosition] = element;
// 				});
// 				stateClone[column] = reord;
// 				// console.log(reord);
// 			});

// 			// // loop over each header and re-sort its rows based on mapped array
// 			// columnHeaders.forEach(column => {
// 			// 	// reorders the current column based on the resorted list (stored in mapped)
// 			// 	stateClone[column] = mapped.map(element => stateClone[column][element.index]);
// 			// });

// 			// console.log(stateClone,'stateClone fin')

// 			return stateClone;
// 		};

// 		onSort = (event, state) => {
// 			const {sortConfig} = this.state;
// 			// console.log('click',event.target.id, state)

// 			let sortedField = event.target.id;
// 			// // const list = [...this.state[sortedField]]

// 			let direction = 1;

// 			if (sortConfig.sortedField === sortedField) {
// 				// if the direction is already up, then change it to down
// 				if (sortConfig.direction === direction) {
// 					direction = -1;
// 					// if the direction is already down, then change it to neutral and sort based on ID (=reset table)
// 				} else if (sortConfig.direction === -direction) {
// 					// direction = 0;
// 					// direction = 1;
// 					sortedField = 'ID';
// 				}
// 			}

// 			// console.log(sortedField, direction, 'config');

// 			// const sortedData = sortTable(this.state, sortedField, direction);
// 			const sortedData = this.sortTable(state, sortedField, direction);

// 			// console.log('sortedData',sortedData)
// 			// this.setState(sortedData);

// 			this.setState({
// 				sortConfig: {
// 					sortedField,
// 					direction,
// 				},
// 			});

// 			return sortedData;
// 		};

// 		render() {
// 			return (
// 				<WrappedComponent
// 					onSort={this.onSort}
// 					sortTable={this.sortTable}
// 					{...this.state}
// 					{...this.props}
// 				/>
// 			);
// 		}
// 	}
// 	return WithSorting;
// }

// export default withSorting;
