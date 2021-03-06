import React from 'react';

import ScreenHeader from '../screen-heading/screen-heading.component';
import GenerateGrid from '../generate-screen-grid/generate-screen-grid.component';

import { INTERVALS, SYMBOLS } from '../../assets/constants';

import './radarscreen.styles.css';

const urlRealTime = 'https://api.tdameritrade.com/v1/marketdata/quotes';
const apikey = 'APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD';

const headerTitle = ['Symbol', 'Interval', 'Price']

const fetchRealTimeData = async (symbol) => {
	// console.log('fetch')

	const params = {apikey, symbol};
	
	const queryExt = new URLSearchParams(params).toString();
	const queryString = urlRealTime.concat('?', queryExt);

	const response = await fetch(queryString);

	if (!response.ok) {
		const message = `An error has occured: ${response.status}`;
		throw new Error(message);
	}

	const data = await response.json();
	console.log(data)
	return data;
}

const sortTable = (state, sortedField, direction) => {
	
	const stateClone = JSON.parse(JSON.stringify(state));
	delete stateClone.header;
	delete stateClone.sortConfig;
	
	// console.log(stateClone,'stateClone orig');
	const list = [...stateClone[sortedField]];
	
	// console.log(list);

	// temporary array holds objects with position and sort-value
	const mapped = list.map((value, index) => {
		if(typeof(value) ==='string') value = value.toLowerCase();
		  
		return { 
			  index, 
			  value 
			};
		}
	);

	// console.log(mapped);

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

	// console.log(mapped);

	// console.log(stateClone,'stateClone start')

	const keys = Object.keys(stateClone);

	keys.forEach(key => {
		// console.log(stateClone[key],'k')

		stateClone[key] = mapped.map(element => stateClone[key][element.index]);
		// console.log(stateClone[key],'mapped')
		// console.log(stateClone,'stateClone')
	})

	// console.log(stateClone,'stateClone fin')

	return stateClone;
}


class RadarScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			header: headerTitle,
			sortConfig: {},
			Symbol: SYMBOLS.slice(0,8),
			Interval: Array(8).fill(INTERVALS[0]),
			Price: Array(8).fill(0)
		}
	}

	componentDidMount() {
		const { Symbol } = this.state;
		// console.log('mount')
		fetchRealTimeData(Symbol)
			.then(data => {
				const prices = Symbol.map((symbolName, index) => {
					return data[symbolName].lastPrice;
				})
				// console.log(prices);
				this.setState({
					Price: prices
				}
				,
				// () => console.log(this.state)
				);
			})
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

		fetchRealTimeData(symbol)
			.then(data => {
				const lastPrice = data[symbol].lastPrice;
				// console.log(lastPrice);

				prices[valueRow] = lastPrice;

				// console.log(prices);

				this.setState({
					Price: prices
				});

			})
			.catch(e => {
				console.log('An error occurred during fetching: ' + e.message);
		  	});


		this.setState({
			[stateKey]: values
		});
	}

	onSort = (event) => {
		const { sortConfig } = this.state;
		// console.log('click',event.target.id)
		
		// const sortedField = 'Price';
		const sortedField = event.target.id;
		// const list = [...this.state[sortedField]]

		let direction = 1;

		if(sortConfig.sortedField === sortedField) {
			if(sortConfig.direction === direction) {
				direction = -1;
			}
			else if(sortConfig.direction === -1) {
				// direction = 0;
			}
		}

		const sortedData = sortTable(this.state, sortedField, direction);
		// console.log(sortedData.Price);
		// console.log(sortedData,'sortedData');

		this.setState({
			sortConfig: {
				sortedField,
				direction
			}
		}
		,
		// ()` => console.log(this.state)
		);

		this.setState(sortedData);

	}

	render() {

		const { header, Symbol } = this.state;
		// console.log('rend',this.state)

		return(
			<div className="radarscreen">
				<div id="grid-container">
					{
						header.map((value, colIdx) => (
								<ScreenHeader 
									key={colIdx.toString()} 
									gridColumn={colIdx+1}
									onSort={this.onSort}
									id={value}
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
										onChange={this.onChange}
										key={`${Symbol[rowIdx]}-${type}`} 
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