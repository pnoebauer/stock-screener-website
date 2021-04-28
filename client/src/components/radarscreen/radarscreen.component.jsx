import React from 'react';

import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';
import Dropdown from '../dropdown/dropdown.component';
import AddStockUniverseButton from '../add-stock-universe-button/add-stock-universe-button.component';

import {
	INTERVALS,
	SYMBOLS,
	API_TO_INDICATORS,
	INDICATORS_TO_API,
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

	componentDidMount() {
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

		this.setState(rehydrate, () => {
			// console.log('mount h', this.state.Symbol, Symbol, rehydrate);
			this.startEventSource(this.state.Symbol);
		});
	}

	componentDidUpdate(prevProps, prevState) {
		let arrayElementsEqual = (arr1, arr2) =>
			[...new Set(arr1)].sort().join() === [...new Set(arr2)].sort().join(); //check if both arrays contain same values (excl. duplicates)

		let sameElements = (arr1, arr2) =>
			[...arr1].sort().join() === [...arr2].sort().join();

		// console.log(
		// 	sameElements(prevState.Symbol, this.state.Symbol),
		// 	prevState.Symbol,
		// 	this.state.Symbol
		// );
		// trigger if symbols or columns change
		if (
			!sameElements(prevState.Symbol, this.state.Symbol) ||
			!arrayElementsEqual(this.getHeaderTitle(prevState), this.getHeaderTitle(this.state))
		) {
			// close old event source and start a new one with updated Symbol
			if (this.events) {
				// console.log('updating, closing eventSource');
				this.events.close();
				// console.log('update', this.events);
				this.startEventSource();
			}
		}
	}

	apiObjectToStateObject(apiObject) {
		const {Symbol} = this.state;
		const header = this.getHeaderTitle(this.state);

		// map the header (= state keys) to INDICATORS_TO_API; do not include permanent headers
		const apiIndicators = header.flatMap(item =>
			permanentHeaders.includes(item) ? [] : [INDICATORS_TO_API[item]]
		);

		let stateIndicatorObject = {};

		try {
			//filter out the indicators that are needed in the columns
			apiIndicators.forEach(apiIndicatorName => {
				// look up the name used for the column header (and state key)
				const stateIndicatorName = API_TO_INDICATORS[apiIndicatorName];
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
		console.log('start new event source');
		const uniqueSymbols = [...new Set(this.state.Symbol)];

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

				let updatedState = {...this.state, ...stateIndicatorObject};

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

				// this.setState((prevState, props) => {
				// 	const sortedTable = props.onSort(event, prevState);
				// }

				// , () => this.updateLocalStorage());
			} else {
				// this.updateLocalStorage();
			}

			// this.setState((prevState, props) => {
			// 	// console.log('tr');
			// 	const sortedTable = props.onSort(event, prevState);
			// 	return sortedTable;
			// });
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
					Interval: rowAdded
						? Object.assign([], prevState.Interval, {[valueRow]: 'Daily'})
						: prevState.Interval,
					ID: rowAdded
						? Object.assign([], prevState.ID, {[valueRow]: maxID + 1})
						: prevState.ID,
				};
			},
			() => {
				// already covered with startEventSource
				// this.updateLocalStorage();
			}
		);
	};

	sortTable = event => {
		this.setState((prevState, props) => {
			// console.log('tr');
			const sortedTable = props.onSort(event, prevState);
			return sortedTable;
		});
	};

	handleColumnUpdate = names => {
		// merge permanentHeaders with the updated column names
		const header = [...permanentHeaders, ...names];

		// stringify the whole state object in order to modify it and to remove
		const clearedState = JSON.parse(JSON.stringify(this.state));

		// unused columns (=state keys) are set to undefined
		Object.keys(clearedState).forEach(key => {
			if (!header.includes(key)) {
				clearedState[key] = undefined;
			}
		});

		// check if all header elements already exist in the state object, if not set the key with that element to an empty array
		header.forEach(headerTitle => {
			if (!Object.keys(clearedState).includes(headerTitle)) {
				clearedState[headerTitle] = [];
			}
		});

		this.setState(clearedState);
	};

	handleRowDelete = e => {
		// console.log('tr del');
		const rowIdx = Number(e.target.id);
		const stateClone = JSON.parse(JSON.stringify(this.state));

		// console.log(stateClone, rowIdx)

		Object.keys(stateClone).forEach(key => {
			stateClone[key].splice(rowIdx, 1);
		});

		this.setState(stateClone, () => {
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

		// console.log('render radar');

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
					<Dropdown
						options={SYMBOLS}
						gridRow={Symbol.length + 2}
						gridColumn={1}
						// key={colIdx.toString()+rowIdx.toString()}
						onChange={this.onRowAdd}
						customStyles={{
							height: '30px',
							borderBottom: '1px solid black',
							borderLeft: '1px solid black',
							marginLeft: '-1px',
						}}
						className={'add-row'}
					>
						{SYMBOLS[Symbol.length]}
					</Dropdown>
					<AddStockUniverseButton
						style={{
							gridColumn: '1',
							gridRow: '1',
						}}
						handleUniverseAdd={this.handleUniverseAdd}
					/>
					<button
						style={{
							border: 'none',
							gridColumn: '1',
							gridRow: `${Symbol.length} + 2`,
							height: '31px',
							borderBottom: '1px solid black',
							borderLeft: '1px solid black',
							borderTop: '1px solid black',
							marginLeft: '-1px',
						}}
						onClick={this.handleDeleteAllRows}
					>
						XX
					</button>
				</div>
			</div>
		);
	}
}

export default RadarScreen;
