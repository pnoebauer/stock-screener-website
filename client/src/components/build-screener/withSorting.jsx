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
			// console.log('sort')

			const stateClone = JSON.parse(JSON.stringify(tableObject));

			delete stateClone.sortConfig;

			// console.log(stateClone,'stateClone orig');
			console.log(
				stateClone[sortedField],
				stateClone,
				sortedField,
				'stateClone[sortedField]'
			);

			const list = [...stateClone[sortedField]];

			const ids = [...stateClone.ID];

			console.log(list, 'list');

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

				return {
					index,
					value,
					id: ids[index],
				};
			});

			// console.log(mapped, 'mapped');

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

			console.log(mapped, 'map sort');

			// const mapSequenceId = mapped.map((element, index) => ({id: element.id, index}));
			// console.log(mapSequenceId, 'mapSequenceId', stateClone.ID, 'ids');

			let idMap = {};
			mapped.forEach((element, index) => (idMap[element.id] = index));

			// console.log(idMap, 'idMap', stateClone.ID, 'ids');

			// table headers (Symbol, Interval, Price, ...)
			const columnHeaders = Object.keys(stateClone);

			// loop over each header and re-sort its rows based on mapped array
			columnHeaders.forEach(column => {
				// reorders the current column based on the resorted list (stored in mapped)
				stateClone[column] = mapped.map(element => stateClone[column][element.index]);
			});

			// // loop over each header and re-sort its rows based on idMap
			// columnHeaders.forEach(column => {
			// 	stateClone[column] = ids.map(id => {
			// 		const reorderedPosition = idMap[id];
			// 		return stateClone[column][reorderedPosition];
			// 	});
			// });

			// console.log(stateClone,'stateClone fin')

			return stateClone;
		};

		onSort = (event, state) => {
			const {sortConfig} = this.state;
			// console.log('click',event.target.id, state)

			let sortedField = event.target.id;
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

			// const sortedData = sortTable(this.state, sortedField, direction);
			const sortedData = this.sortTable(state, sortedField, direction);

			// console.log('sortedData',sortedData)
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
