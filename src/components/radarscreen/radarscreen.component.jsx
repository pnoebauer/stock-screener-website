import React from 'react';
import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';

import { INTERVALS, SYMBOLS } from '../../assets/constants';

import './radarscreen.styles.css';

// const headerTitle = ['Symbol', 'Interval', 'Price']

// generate-grid-cell
// const dropdownOptions = {
// 	Symbol: SYMBOLS,
// 	Interval: INTERVALS
// }
const permanentHeaders = ['Symbol', 'Interval'];


const indicatorsMapRev = {
	'52WkHigh': '52 Week High',
	'52WkLow': '52 Week Low',
	askPrice: 'Ask Price',
	askSize: 'Ask Size',
	assetType: 'Asset Type',
	bidPrice: 'Bid Price',
	bidSize: 'Bid Size',
	closePrice: 'Close Price',
	divAmount: 'Dividend Amount',
	divDate: 'Dividend Date',
	divYield: 'Dividend Yield',
	exchangeName: 'Exchange',
	highPrice: 'High Price',
	lastPrice: 'Last Price',
	lastSize: 'Last Size',
	lowPrice: 'Low Price',
	mark: 'Mark',
	markChangeInDouble: 'Mark Change',
	markPercentChangeInDouble: 'Mark Change (%)',
	nAV: 'Net Asset Value',
	netChange: 'Net Change',
	netPercentChangeInDouble: 'Net Change (%)',
	openPrice: 'Open Price',
	peRatio: 'PE Ratio',
	totalVolume: 'Volume',
	volatility: 'Volatility'
};

const indicatorsMap = {
	'52 Week High': '52WkHigh',
	'52 Week Low': '52WkLow',
	'Ask Price': 'askPrice',
	'Ask Size': 'askSize',
	'Asset Type': 'assetType',
	'Bid Price': 'bidPrice',
	'Bid Size': 'bidSize',
	'Close Price': 'closePrice',
	'Dividend Amount': 'divAmount',
	'Dividend Date': 'divDate',
	'Dividend Yield': 'divYield',
	'Exchange': 'exchangeName',
	'High Price': 'highPrice',
	'Last Price': 'lastPrice',
	'Last Size': 'lastSize',
	'Low Price': 'lowPrice',
	'Mark': 'mark',
	'Mark Change': 'markChangeInDouble',
	'Mark Change (%)': 'markPercentChangeInDouble',
	'Net Asset Value': 'nAV',
	'Net Change': 'netChange',
	'Net Change (%)': 'netPercentChangeInDouble',
	'Open Price': 'openPrice',
	'PE Ratio': 'peRatio',
	'Volume': 'totalVolume',
	'Volatility': 'volatility' 
};


class RadarScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// header: headerTitle,
			Symbol: SYMBOLS.slice(0,8),
			Interval: Array(8).fill(INTERVALS[0]),
			'Last Price': Array(8).fill(0),
			'Volume': Array(8).fill(0)
		}

		this.state.header = Object.keys(this.state);

		// console.log(this.state)
		this.setHeaderTitle();
	}

	setHeaderTitle = () => {
		const { header, ...rest } = this.state;
		const headerTitle = Object.keys(rest);
		// console.log(headerTitle);
	}

	fetchAndSetState = (apiIndicators, clearedState) => {
		
		const { Symbol } = this.state;

		let stateUpdates = {};

		this.props.fetchRealTimeData(Symbol, apiIndicators)
		.then(indicatorObject => {
			// Object.keys(indicatorObject).forEach(indicator => {
			apiIndicators.forEach(apiIndicator => {
				const indicatorColumn = indicatorsMapRev[apiIndicator];
				stateUpdates = {
					...stateUpdates,
					[indicatorColumn]: indicatorObject[apiIndicator]
				};

				// console.log(stateUpdates,'stateUpdates')
			});
			return stateUpdates
		})
		.then(stateUpdates => this.setState({...stateUpdates,...clearedState}, () => console.log(this.state,'s')))
	}

	componentDidMount() {
		const { Symbol, header } = this.state;
		// console.log('mount')

		const apiIndicators = header.flatMap(item => 
			permanentHeaders.includes(item) ? [] : [indicatorsMap[item]]
		)
		// console.log('apiIndicators',apiIndicators)
		
		this.fetchAndSetState(apiIndicators);
		
	}

	onChange = (updatedValue, headerCol, valueRow) => {

		const {fetchRealTimeData} = this.props;
		this.setState(prevState => {
			const columnName = prevState.header[headerCol];	//which column changed (Symbol, Interval)
			return {
				[columnName]: Object.assign([], prevState[columnName], {[valueRow]: updatedValue})
			}
		}
		,
		() => {
			fetchRealTimeData(new Array(this.state.Symbol[valueRow]), ['lastPrice', 'highPrice'])
			.then(indicatorObject => {
				Object.keys(indicatorObject).forEach(indicator => 
					this.setState(prevState => ({
							[indicator]: Object.assign([], prevState[indicator], {[valueRow]: indicatorObject[indicator][0]})
						})
					)
				)
			});
		})
	}

	sortTable = (event) => {
		const sortedTable = this.props.onSort(event, this.state);
		this.setState(sortedTable);
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
		console.log(names, 'names');

		const headerTitles = [...permanentHeaders, ...names];
		// console.log(headerTitles,'headerTitles');

		const apiIndicators = names.map(item => indicatorsMap[item]);


		let clearedState = JSON.parse(JSON.stringify(this.state));

		Object.keys(clearedState).forEach(key => {
			if(!headerTitles.includes(key)) {
				clearedState = {
					...clearedState,
					[key]: null
				}
			}
		})

		clearedState.header = headerTitles;

		this.fetchAndSetState(apiIndicators,clearedState);

	}
	
	render() {
		const { header } = this.state;
		const { sortConfig } = this.props;
		// console.log('rend',this.state,this.props)

		const usedIndicators = header.flatMap(item => 
			permanentHeaders.includes(item) ? [] : [item]
		);

		// console.log(usedIndicators,'usedIndicators')

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
						onChange={this.onChange}
					/>
				</div>
		</div>
		)
	}
}

export default RadarScreen;