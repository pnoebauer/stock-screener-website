import React from 'react';

import {
	INTERVALS,
	SYMBOLS,
	API_TO_INDICATORS,
	INDICATORS_TO_API,
	CUSTOM_INDICATORS,
} from '../../assets/constants';

const permanentHeaders = ['ID', 'Symbol', 'Interval'];

function withDataUpdate(WrappedComponent) {
	class WithDataUpdate extends React.Component {
		constructor(props) {
			super(props);
			this.events = undefined;
			this.state = {
				Symbol: SYMBOLS.slice(0, 5),
				Interval: Array(5).fill(INTERVALS[0]),
				ID: [...Array(5)].map((a, idx) => idx),
			};
		}

		// Returns all the headers based on state object keys
		getHeaderTitle = stateObj => {
			let headerTitle = Object.keys(stateObj).filter(key => stateObj[key] !== undefined);
			headerTitle = headerTitle.filter(item => item !== 'ID');
			return headerTitle;
		};

		updateLocalStorage() {
			// console.log('local storage update');
			localStorage.setItem('header', this.getHeaderTitle(this.state));
			localStorage.setItem('Symbol', this.state.Symbol);
			localStorage.setItem('Interval', this.state.Interval);
			localStorage.setItem('ID', this.state.ID);
		}

		async componentDidMount() {
			let {Symbol, Interval, ID} = this.state;
			let rehydrate = {};
			let header;
			try {
				header = localStorage.getItem('header').split(',');
				Symbol = localStorage.getItem('Symbol').split(',');
				Interval = localStorage.getItem('Interval').split(',');
				ID = localStorage.getItem('ID').split(',');

				rehydrate = {...rehydrate, Symbol, Interval, ID};

				header.forEach(headerTitle => {
					if (!Object.keys(rehydrate).includes(headerTitle)) {
						rehydrate[headerTitle] = [];
					}
				});
			} catch {
				header = this.getHeaderTitle(this.state);
			}

			// update CUSTOM_INDICATORS configs
			header.forEach(header => {
				if (
					Object.keys(CUSTOM_INDICATORS).includes(header) &&
					localStorage.getItem(header)
				) {
					// console.log(header, JSON.parse(localStorage.getItem(header)));
					CUSTOM_INDICATORS[header] = JSON.parse(localStorage.getItem(header));
				}
			});

			// console.log(CUSTOM_INDICATORS, 'ci');

			this.setState(rehydrate, () => {
				// console.log('mount h', this.state.Symbol, Symbol, rehydrate);
				this.startEventSource(this.state.Symbol);
				// this.updateCustomIndicators();
			});
		}

		async componentDidUpdate(prevProps, prevState) {
			// console.log(INDICATORS_TO_API, 'INDICATORS_TO_API');
			let arrayElementsEqual = (arr1, arr2) =>
				[...new Set(arr1)].sort().join() === [...new Set(arr2)].sort().join(); //check if both arrays contain same values (excl. duplicates)

			let sameElements = (arr1, arr2) =>
				[...arr1].sort().join() === [...arr2].sort().join(); //check if both arrays are equal (incl. duplicates)

			const currentHeaders = this.getHeaderTitle(this.state);
			const prevHeaders = this.getHeaderTitle(prevState);

			// trigger if symbols or columns change
			if (
				!sameElements(prevState.Symbol, this.state.Symbol) ||
				!arrayElementsEqual(prevHeaders, currentHeaders)
			) {
				// close old event source and start a new one with updated Symbol
				if (this.events) {
					// console.log('updating, closing eventSource', prevState.Symbol, this.state.Symbol);
					this.events.close();
					// console.log('update', this.events);
					this.startEventSource();
				}
			}

			const newCustomIndicators = currentHeaders.flatMap(header =>
				Object.keys(CUSTOM_INDICATORS).includes(header) && !prevHeaders.includes(header)
					? [header]
					: []
			);

			const {indicatorConfigs} = this.getIndicatorConfigs(undefined, newCustomIndicators);
			if (Object.keys(indicatorConfigs).length) {
				// console.log(indicatorConfigs, 'ic');

				this.updateCustomIndicators(undefined, indicatorConfigs);
			}
		}

		// fetches data for custom indicators from backend
		async getCustomIndicators(requestObj) {
			// console.log(requestObj, 'requestObj');
			try {
				const response = await fetch('http://localhost:4000/scanner', {
					method: 'POST', // *GET, POST, PUT, DELETE, etc.
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(requestObj), // body data type must match "Content-Type" header
				});

				const data = await response.json();
				// console.log(data, 'data');
				return data;
			} catch (e) {
				console.log('Error fetching custom indicators from backend', e);
			}
		}

		// helper function: get configs for custom indicators and the current state array of those indicators (if only one symbol is updated)
		getIndicatorConfigs = (symbolIndex, indicatorList) => {
			let indicatorConfigs = {};
			let stateIndicators = {};

			const headers = indicatorList ?? this.getHeaderTitle(this.state);
			// loop over all headers and store the configuration of the custom indicators in the indicatorConfigs object
			headers.forEach(header => {
				if (indicatorList ?? Object.keys(CUSTOM_INDICATORS).includes(header)) {
					const indicatorName = header.toLowerCase(); //the backend stores indicators in lowerCase

					// indicatorConfigs[indicatorName] =
					// 	JSON.parse(localStorage.getItem(header)) || CUSTOM_INDICATORS[header];
					indicatorConfigs[indicatorName] = CUSTOM_INDICATORS[header];

					stateIndicators[header] =
						symbolIndex !== undefined ? [...this.state[header]] : []; //if an index is provided, copy the state array for that indicator
				}
			});

			// console.log(CUSTOM_INDICATORS, 'getConfig');

			return {
				indicatorConfigs,
				stateIndicators,
			};
		};

		// helper function: fetches values for custom indicators from backend and converts them into the required format for the state
		getValuesForCustomIndicators = async (
			indicatorConfigs,
			stateIndicators,
			symbolIndex
		) => {
			var stateIndicators = JSON.parse(JSON.stringify(stateIndicators)); //clone the object so that the original object is not mutated

			//if no symbolIndex is provided all symbols will be updated, otherwise only that row
			const startIndex = symbolIndex || 0;
			const endIndex = symbolIndex + 1 || this.state.Symbol.length;

			for (let index = startIndex; index < endIndex; index++) {
				const symbol = this.state.Symbol[index];
				const interval = this.state.Interval[index];

				const requestObj = {
					symbol,
					interval,
					indicators: indicatorConfigs,
				};

				// console.log(requestObj, 'requestObj', this.state);

				const indicatorObject = await this.getCustomIndicators(requestObj); //get the data from the backend

				// loop over all indicators and assign the returned values from the backend to the temporary stateIndicators state object
				Object.keys(indicatorConfigs).forEach(
					indicator =>
						(stateIndicators[indicator.toUpperCase()] = Object.assign(
							[],
							stateIndicators[indicator.toUpperCase()],
							{
								[index]: Number(indicatorObject[indicator]),
							}
						))
				);
			}

			return stateIndicators;
		};

		// uses getIndicatorConfigs and getValuesForCustomIndicators based on provided args; resorts the data based on the current sort config and sets the state
		updateCustomIndicators = async (symbolIndex, indicatorConfigs) => {
			// console.log('updateCustomIndicators');

			// (1) get indicatorConfigs an the current state arrays for the to be updated indicators
			if (indicatorConfigs === undefined) {
				var {indicatorConfigs, stateIndicators} = this.getIndicatorConfigs(symbolIndex);
			} else {
				const updatedIndicator = Object.keys(indicatorConfigs)[0].toUpperCase(); //API uses lowerCase, state uses upperCase
				var stateIndicators = {[updatedIndicator]: []}; //all values will be updated for that column, hence an empty array is provided (as the whole array will be updated)
			}

			// (2) get values for the to be updated indicators
			if (Object.keys(indicatorConfigs).length) {
				const updatedStateIndicators = await this.getValuesForCustomIndicators(
					indicatorConfigs,
					stateIndicators,
					symbolIndex
				);

				// console.log(updatedStateIndicators, 'updatedStateIndicators');

				const {sortConfig, sortTable} = this.props;

				let updatedState = {...this.state, ...updatedStateIndicators};

				//sorted table cache will be deleted once new data arrives
				localStorage.removeItem('sortedTable');

				if (Object.keys(sortConfig).length) {
					// console.log('sorting');
					updatedState = sortTable(
						updatedState,
						sortConfig.sortedField,
						sortConfig.direction
					);
				}
				// console.log('set state after message');

				this.setState(updatedState, () => this.updateLocalStorage());
			}
		};

		// helper function: converts the received api data object into the format of the state object
		apiObjectToStateObject(apiObject) {
			const {Symbol} = this.state;
			const header = this.getHeaderTitle(this.state);

			// map the header (= state keys) to INDICATORS_TO_API; do not include permanent headers or customIndicators
			const customIndicators = Object.keys(CUSTOM_INDICATORS);
			const permanentOrCustomIndicators = [...permanentHeaders, ...customIndicators];

			const apiIndicators = header.flatMap(item =>
				permanentOrCustomIndicators.includes(item) ? [] : [INDICATORS_TO_API[item]]
			);

			// console.log(apiIndicators, Symbol);

			let stateIndicatorObject = {};

			try {
				//filter out the indicators that are needed in the columns
				apiIndicators.forEach(apiIndicatorName => {
					// look up the name used for the column header (and state key)
					const stateIndicatorName = API_TO_INDICATORS[apiIndicatorName];

					// converts api object to state array format
					stateIndicatorObject = {
						...stateIndicatorObject,
						[stateIndicatorName]: Symbol.map(
							symbolName => apiObject[symbolName][apiIndicatorName]
						),
					};
				});
			} catch (e) {
				console.log('error converted apiObject to stateObject', e);
			}

			return stateIndicatorObject;
		}

		// uses apiObjectToStateObject; starts event source to subscribe to the stock data stream from the backend; resorts the data based on the current sort config and sets the state
		startEventSource() {
			const uniqueSymbols = [...new Set(this.state.Symbol)];
			// console.log('start new event source', uniqueSymbols);

			const url = `http://localhost:4000/events/symbols?id=${uniqueSymbols.join(',')}`;

			this.events = new EventSource(url);

			// // Subscribe to event with type 'test'
			// this.events.addEventListener('test', function (event) {
			// 	console.log('event.data', event.data);
			// });

			// Subscribe to all events without an explicit type
			this.events.onmessage = event => {
				const {sortConfig, sortTable} = this.props;
				const symbolsDataObject = JSON.parse(event.data);

				if (Object.keys(symbolsDataObject).length) {
					const stateIndicatorObject = this.apiObjectToStateObject(symbolsDataObject);

					let updatedState = {...this.state, ...stateIndicatorObject};

					//sorted table cache will be deleted once new data arrives
					localStorage.removeItem('sortedTable');

					if (Object.keys(sortConfig).length) {
						updatedState = sortTable(
							updatedState,
							sortConfig.sortedField,
							sortConfig.direction
						);
					}
					// console.log('set state after message');

					this.setState(updatedState, () => this.updateLocalStorage());
				}
				// else {
				// 	this.updateLocalStorage();
				// }
			};
		}

		componentWillUnmount() {
			if (this.events) {
				// console.log('unmounting, closing eventSource');
				this.events.close();
			}
		}

		//used for dropdowns - updates one row
		onChange = (updatedValue, headerCol, valueRow, rowAdded) => {
			const header = this.getHeaderTitle(this.state);

			// if (rowAdded) valueRow = this.state.Symbol.length - 1;

			let index = valueRow;

			//update the changed cell (Symbol, Interval)
			this.setState(
				prevState => {
					if (rowAdded) {
						console.log(index, prevState.Symbol.length, 'ra');
						index = prevState.Symbol.length;
					}

					const columnName = header[headerCol]; //which column changed (Symbol, Interval)
					const maxID = Math.max(...prevState.ID, 1);

					// if (rowAdded)
					// 	console.log(
					// 		'change A',
					// 		updatedValue,
					// 		headerCol,
					// 		valueRow,
					// 		prevState.Symbol.length
					// 	);

					return {
						// if a row was added set interval to a default of 'Day' and increment its ID by 1 above the max
						Interval: rowAdded
							? Object.assign([], prevState.Interval, {[index]: INTERVALS[0]})
							: //   Object.assign([], prevState.Interval, {
							  // 		[prevState.Symbol.length - 1]: INTERVALS[0],
							  //   })
							  prevState.Interval,
						ID: rowAdded
							? Object.assign([], prevState.ID, {[index]: maxID + 1})
							: //   Object.assign([], prevState.ID, {
							  // 		[prevState.Symbol.length - 1]: maxID + 1,
							  //   })
							  prevState.ID,
						// updates that one value that changed in the array
						[columnName]: Object.assign([], prevState[columnName], {
							[index]: updatedValue,
						}),
						// [columnName]: rowAdded
						// 	? Object.assign([], prevState[columnName], {
						// 			[prevState.Symbol.length - 1]: updatedValue,
						// 	  })
						// 	: Object.assign([], prevState[columnName], {
						// 			[valueRow]: updatedValue,
						// 	  }),
					};
				},
				() => {
					// if (rowAdded)
					// 	console.log(
					// 		'change',
					// 		this.state,
					// 		updatedValue,
					// 		headerCol,
					// 		valueRow,
					// 		this.state.Symbol.length - 1
					// 	);
					// already covered with startEventSource
					// this.updateLocalStorage();

					// this.updateCustomIndicators(valueRow);

					if (rowAdded) index = this.state.Symbol.length - 1;

					this.updateCustomIndicators(index);
				}
			);
		};

		handleTableSorting = event => {
			// console.log('sortTable', event.target, 'e');
			if (event.target.getAttribute('name') !== 'screen-header') {
				// event.preventDefault();
				// event.stopPropagation();
				return;
			}
			const sortedField = event.currentTarget.id;

			this.setState((prevState, props) => {
				const sortedTable = props.onSort(sortedField, prevState);
				return sortedTable;
			});
		};

		handleColumnUpdate = names => {
			// console.log(names);

			const headerNames = names.map(item => {
				// console.log(CUSTOM_INDICATORS.includes(item.name), item.name, 'handleColumnUpdate');
				if (Object.keys(CUSTOM_INDICATORS).includes(item.name)) {
					CUSTOM_INDICATORS[item.name] = item.config;
				}

				return item.name;
			});

			// console.log(INDICATORS_TO_API);

			// merge permanentHeaders with the updated column names
			const header = [...permanentHeaders, ...headerNames];

			// stringify the whole state object in order to modify it and to remove
			const clearedState = JSON.parse(JSON.stringify(this.state));

			// unused columns (=state keys) are set to undefined
			Object.keys(clearedState).forEach(key => {
				if (!header.includes(key)) {
					clearedState[key] = undefined;
				}
			});

			// check if all header elements already exist in the state object,
			// if not set the key with that element to an empty array
			header.forEach(headerTitle => {
				if (!Object.keys(clearedState).includes(headerTitle)) {
					clearedState[headerTitle] = [];
				}
			});

			this.setState(clearedState);
		};

		handleDeleteRow = e => {
			const rowIdx = Number(e.currentTarget.id);
			const stateClone = JSON.parse(JSON.stringify(this.state));

			// console.log(stateClone, rowIdx)

			Object.keys(stateClone).forEach(key => {
				stateClone[key].splice(rowIdx, 1);
			});

			this.setState(stateClone, () => {
				// console.log(this.state, stateClone);
				// already covered with startEventSource
				// this.updateLocalStorage();
			});
		};

		handleDeleteAllRows = e => {
			Object.keys(this.state).forEach(key => {
				this.setState({[key]: []});
			});
		};

		onRowAdd = (updatedValue, headerCol, valueRow) =>
			this.onChange(updatedValue, headerCol, valueRow, true);

		handleUniverseAdd = symbols => {
			// console.log('tr uni');
			const numberAddedSymbols = symbols.length;

			const stateClone = JSON.parse(JSON.stringify(this.state));
			const maxID = Math.max(...stateClone.ID, 0);
			// console.log(maxID, 'maxID');

			stateClone.Symbol = [...stateClone.Symbol, ...symbols];
			stateClone.Interval = [
				...stateClone.Interval,
				...Array(numberAddedSymbols).fill(INTERVALS[0]),
			];
			stateClone.ID = [
				...stateClone.ID,
				...[...Array(numberAddedSymbols)].map((a, idx) => idx + maxID + 1),
			];

			this.setState(stateClone, () => this.updateCustomIndicators());
		};

		handleSetAllIntervals = interval => {
			this.setState(
				prevState => {
					const numberSymbols = prevState.Symbol.length;
					return {Interval: Array(numberSymbols).fill(interval)};
				},
				() => this.updateCustomIndicators()
			);
		};

		render() {
			const headers = this.getHeaderTitle(this.state);
			return (
				<WrappedComponent
					handleTableSorting={this.handleTableSorting}
					updateCustomIndicators={this.updateCustomIndicators}
					updateCustomIndicators={this.updateCustomIndicators}
					handleSetAllIntervals={this.handleSetAllIntervals}
					handleColumnUpdate={this.handleColumnUpdate}
					onChange={this.onChange}
					handleDeleteRow={this.handleDeleteRow}
					onRowAdd={this.onRowAdd}
					handleUniverseAdd={this.handleUniverseAdd}
					handleDeleteAllRows={this.handleDeleteAllRows}
					headers={headers}
					dataObject={this.state}
					{...this.props}
				/>
			);
		}
	}
	return WithDataUpdate;
}

export default withDataUpdate;
