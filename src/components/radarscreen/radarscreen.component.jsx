import React from 'react';

import ScreenHeader from '../screen-heading/screen-heading.component';
import GenerateGrid from '../generate-screen-grid/generate-screen-grid.component';

import { INTERVALS, SYMBOLS } from '../../assets/constants';

import './radarscreen.styles.css';


const headerTitle = ['Symbol', 'Interval', 'Price']


class RadarScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			header: headerTitle,
			Symbol: SYMBOLS.slice(0,8),
			Interval: Array(8).fill(INTERVALS[0]),
			Price: Array(8).fill(0)
		}
	}

	componentDidMount() {
		const { Symbol } = this.state;
		// console.log('mount')
		this.props.fetchRealTimeData(Symbol, 'lastPrice')
		.then(data => this.setState({
					Price: data
				})	
		);
	}

	onChange = (updatedValue, headerCol, valueRow) => {
		const stateKey = this.state.header[headerCol];	//which column changed (Symbol, Interval)
		const values = [...this.state[stateKey]];	//all values of that column from top to bottom
		const prices = [...this.state.Price];	//all prices

		values[valueRow] = updatedValue;	//update that particular cell that changed (i.e. GOOGL to AMZN)
		// console.log('change', stateKey, updatedValue, this.state.header[headerCol], valueRow);
		
		let symbol = updatedValue, interval = updatedValue; //set symbol and interval to that new value
		if (stateKey==='Symbol') {	//if a value in the Symbol column changed
			interval = this.state.Interval[valueRow];	//reset Interval for that row to the prior value
		}
		else if (stateKey==='Interval') {	//if a value in the Interval column changed
			symbol = this.state.Symbol[valueRow];	//reset Symbol for that row to the prior value
		}
		// console.log('symbol', symbol, 'interval', interval);
		// console.log('onchange',headerCol, valueRow)

		this.props.fetchRealTimeData(new Array(symbol), 'lastPrice')
		.then(lastPrice => {
			prices[valueRow] = lastPrice[0];
			this.setState({
				Price: prices,
				[stateKey]: values
			});
		});
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
	
	render() {
		const { header, Symbol } = this.state;
		// console.log('rend',this.state)
		// console.log('rend',this.props)
		

		return(
			<div className="radarscreen">
				<div id="grid-container">
					{
						header.map((value, colIdx) => (
								<ScreenHeader 
									key={colIdx.toString()} 
									gridColumn={colIdx+1}
									onSort={this.sortTable}
									id={value}
									className={`screen-header ${this.getClassNameForHeader(value)}`}
								>
									{value}
								</ScreenHeader>
							)
						)
					}
					
					{
						//loop through the header items (columns) and afterwards loop through stored values (rows)  
						header.map((type, colIdx) => this.state[type].map((rowVal,rowIdx) => (
									<GenerateGrid
										type={type}
										gridLocation={{rowIdx, colIdx}}
										onChange={e=>this.onChange(e)}
										key={`${Symbol[rowIdx]}-${type}-${rowIdx}`} 
									>
										{rowVal}
									</GenerateGrid>
								)
							)
						) 
					}
					
				</div>
		</div>
		)
	}
}


export default RadarScreen;