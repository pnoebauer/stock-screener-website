import React from 'react';
import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';

import { INTERVALS, SYMBOLS, API_TO_INDICATORS, INDICATORS_TO_API } from '../../assets/constants';

import './radarscreen.styles.css';

const permanentHeaders = ['Symbol', 'Interval'];




class RadarScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Symbol: SYMBOLS.slice(0,8),
			Interval: Array(8).fill(INTERVALS[0]),
			'Last Price': Array(8).fill(0)
		}
	}

	getHeaderTitle = () => {
		const headerTitle = Object.keys(this.state).filter(key => this.state[key] !== null);
		return headerTitle;
	}

	
	fetchAndSetState = (Symbol, apiIndicators, clearedState, valueRow) => {

		const { fetchRealTimeData } = this.props;
		
		let stateUpdates = {};

		//fetch for all symbols and the apiIndicators
		fetchRealTimeData(Symbol, apiIndicators)
		.then(indicatorObject => {
			// loop over all apiIndicators
			apiIndicators.forEach(apiIndicator => {
				// look up the name used for the column header (and state key)
				const indicatorColumn = API_TO_INDICATORS[apiIndicator];

				const updatedRow = valueRow!==undefined ? Object.assign([], this.state[indicatorColumn], {[valueRow]: indicatorObject[apiIndicator][0]}) : indicatorObject[apiIndicator]

				// merge the result of the current indicator column with the temp state object
				stateUpdates = {
					...stateUpdates,
					// [indicatorColumn]: indicatorObject[apiIndicator]
					[indicatorColumn]: updatedRow
				};
			});
			return stateUpdates
		})
		// update state to the updated indicators and the clearedState (all unused indicators set to null)
		.then(stateUpdates => this.setState({...stateUpdates,...clearedState}
			,
			() => {
				// console.log(this.getHeaderTitle())
				localStorage.setItem('header', this.getHeaderTitle());
				localStorage.setItem('Symbol', this.state.Symbol);
				localStorage.setItem('Interval', this.state.Interval);
			}
		))
	}

	componentDidMount() {
		let { Symbol, Interval } = this.state;

		let rehydrate = {};

		let header;
		try {
			header = localStorage.getItem('header').split(',');
			Symbol = localStorage.getItem('Symbol').split(',');
			Interval = localStorage.getItem('Interval').split(',');

			rehydrate = {...rehydrate, Symbol, Interval}
			// console.log('rehydrate',rehydrate)
		}
		catch {
			header = this.getHeaderTitle();
		}


		// map the header (= state keys) to INDICATORS_TO_API; do not include permanent headers
		const apiIndicators = header.flatMap(item => 
			permanentHeaders.includes(item) ? [] : [INDICATORS_TO_API[item]]
		)
		
		this.setState(rehydrate
			,
			() => {
				// console.log('reh', this.state)
				this.fetchAndSetState(Symbol, apiIndicators)
			}
		)
		

		// this.fetchAndSetState(Symbol, apiIndicators);


	}

	onChange = (updatedValue, headerCol, valueRow) => {

		const header = this.getHeaderTitle();

		const apiIndicators = header.flatMap(item => 
			permanentHeaders.includes(item) ? [] : [INDICATORS_TO_API[item]]
		)

		this.setState(prevState => {
			const columnName = header[headerCol]; //which column changed (Symbol, Interval)
			return {
				[columnName]: Object.assign([], prevState[columnName], {[valueRow]: updatedValue})
			}
		}
		,
		() => {
			const Symbol = new Array(this.state.Symbol[valueRow]);
			this.fetchAndSetState(Symbol, apiIndicators, {}, valueRow);
		})
	}

	sortTable = (event) => {
		this.setState((prevState, props) => {
			const sortedTable = props.onSort(event, prevState);
			return sortedTable;
		});
	}

	getClassNameForHeader = name => {
		const { sortConfig } = this.props;
		if (!sortConfig) {
			return;
		}
		const direction = sortConfig.direction === 1 ? 'ascending' : 'descending'; 
		return sortConfig.sortedField === name ? direction : undefined;
	};

	handleColumnUpdate = names => {
		const { Symbol } = this.state;
		// merge permanentHeaders with the updated column names
		const headerTitles = [...permanentHeaders, ...names];

		const apiIndicators = names.map(item => INDICATORS_TO_API[item]);

		let clearedState = JSON.parse(JSON.stringify(this.state));

		Object.keys(clearedState).forEach(key => {
			if(!headerTitles.includes(key)) {
				clearedState = {
					...clearedState,
					[key]: null
				}
			}
		});
		
		this.fetchAndSetState(Symbol,apiIndicators,clearedState);
	}
	
	render() {
		const header = this.getHeaderTitle();
		// passed from the withSort HOC
		const { sortConfig } = this.props;

		const usedIndicators = header.flatMap(item => 
			permanentHeaders.includes(item) ? [] : [item]
		);

		return (
			<div className="radarscreen">
				<div id="grid-container" 
					style={{gridTemplateColumns: `repeat(${header.length}, 1fr) 0`}}
				>
					<ScreenHeader 
						header={header}
						sortTable={this.sortTable}
						sortConfig={sortConfig}
					/>
					<AddColumnButton 
						style={{
                            gridColumn: `${header.length}+1`
                        }}
						handleColumnUpdate={this.handleColumnUpdate}
						usedIndicators={usedIndicators}
					/>
					<GenerateGrid 
						{...this.state}
						header={header}
						onChange={this.onChange}
					/>
				</div>
		</div>
		)
	}
}

export default RadarScreen;