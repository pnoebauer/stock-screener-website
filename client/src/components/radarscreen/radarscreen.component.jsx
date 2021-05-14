import React from 'react';

import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';
import AddRowInput from '../add-row-input/add-row-input.component';
import AddStockUniverseButton from '../add-stock-universe-button/add-stock-universe-button.component';
import DeleteAllRows from '../delete-all-rows/delete-all-rows.component';

import {
	INTERVALS,
	SYMBOLS,
	API_TO_INDICATORS,
	INDICATORS_TO_API,
	CUSTOM_INDICATORS,
} from '../../assets/constants';

import './radarscreen.styles.css';

const permanentHeaders = ['ID', 'Symbol', 'Interval'];

let updateKey = null;

class RadarScreen extends React.PureComponent {
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

	async getCustomIndicators(requestObj) {
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

			const indicatorObject = await this.getCustomIndicators(requestObj); //get the data from the backend

			// loop over all indicators and assign the returned values from the backend to the temporary stateIndicators state object
			Object.keys(indicatorConfigs).forEach(
				indicator =>
					(stateIndicators[indicator.toUpperCase()] = Object.assign(
						[],
						stateIndicators[indicator.toUpperCase()],
						{
							[index]: indicatorObject[indicator],
						}
					))
			);
		}

		return stateIndicators;
	};

	updateCustomIndicators = async (symbolIndex, indicatorConfigs) => {
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

			this.setState(updatedStateIndicators);
		}
	};

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

	startEventSource() {
		const uniqueSymbols = [...new Set(this.state.Symbol)];
		// console.log('start new event source', uniqueSymbols);

		const url = `http://localhost:4000/events/symbols?id=${uniqueSymbols.join(',')}`;
		// http://localhost:4000/events/tag?id=SPY,AAPL,GOOGL
		// this.events = new EventSource('http://localhost:4000/events');
		this.events = new EventSource(url);

		// // Subscribe to event with type 'test'
		// this.events.addEventListener('test', function (event) {
		// 	console.log('event.data', event.data);
		// });

		// Subscribe to all events without an explicit type
		this.events.onmessage = event => {
			const {sortConfig, sortTable} = this.props;
			const symbolsDataObject = JSON.parse(event.data);

			// console.log(symbolsDataObject, 'symbolsDataObject');
			// console.log(this.props.sortConfig, 'sortConfig');

			if (Object.keys(symbolsDataObject).length) {
				const stateIndicatorObject = this.apiObjectToStateObject(symbolsDataObject);
				// console.log(stateIndicatorObject, 'sio');

				let updatedState = {...this.state, ...stateIndicatorObject};

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
			} else {
				this.updateLocalStorage();
			}
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

		//update the changed cell (Symbol, Interval)
		this.setState(
			prevState => {
				const columnName = header[headerCol]; //which column changed (Symbol, Interval)
				const maxID = Math.max(...prevState.ID, 1);

				return {
					// updates that one value that changed in the array
					[columnName]: Object.assign([], prevState[columnName], {
						[valueRow]: updatedValue,
					}),
					// if a row was added set interval to a default of 'Day' and increment its ID by 1 above the max
					Interval: rowAdded
						? Object.assign([], prevState.Interval, {[valueRow]: 'Day'})
						: prevState.Interval,
					ID: rowAdded
						? Object.assign([], prevState.ID, {[valueRow]: maxID + 1})
						: prevState.ID,
				};
			},
			() => {
				// already covered with startEventSource
				// this.updateLocalStorage();

				this.updateCustomIndicators(valueRow);
			}
		);
	};

	sortTable = event => {
		console.log('called sort', event.target);
		// if (event.target.name === 'configuration') {
		// 	console.log('conf');
		event.preventDefault();
		event.stopPropagation();
		// 	return;
		// }
		this.setState((prevState, props) => {
			// console.log('sortTable', event.target.id);
			const sortedTable = props.onSort(event, prevState);
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

	handleRowDelete = e => {
		const rowIdx = Number(e.target.id);
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

		this.setState(stateClone);
	};

	render() {
		const header = this.getHeaderTitle(this.state);
		// passed from the withSort HOC
		const {sortConfig} = this.props;
		const {Symbol} = this.state;

		// console.log('render radar', header, Symbol, this.state);

		const usedIndicators = header.flatMap(item =>
			permanentHeaders.includes(item) ? [] : [item]
		);

		updateKey = header;

		return (
			<div className='radarscreen'>
				<div
					id='grid-container'
					style={{
						gridTemplateColumns: `20px repeat(${header.length}, 1fr) 0`,
						gridTemplateRows: `repeat(${Symbol.length + 1}, 1fr) 0`,
					}}
				>
					<ScreenHeader
						header={header}
						sortTable={this.sortTable}
						sortConfig={sortConfig}
						updateCustomIndicators={this.updateCustomIndicators}
					/>
					<AddColumnButton
						style={{
							gridColumn: `${header.length + 2}`,
						}}
						handleColumnUpdate={this.handleColumnUpdate}
						usedIndicatorsDefault={usedIndicators}
						key={updateKey}
					/>
					<GenerateGrid
						{...this.state}
						header={header}
						onChange={this.onChange}
						handleRowDelete={this.handleRowDelete}
					/>
					<AddRowInput rowNumber={Symbol.length} onRowAdd={this.onRowAdd} />
					<AddStockUniverseButton
						style={{
							gridColumn: '1',
							gridRow: '1',
						}}
						handleUniverseAdd={this.handleUniverseAdd}
					/>
					<DeleteAllRows
						handleDeleteAllRows={this.handleDeleteAllRows}
						gridRow={Symbol.length + 2}
					/>
				</div>
			</div>
		);
	}
}

export default RadarScreen;
