import React from 'react';

import Dropdown from './dropdown.component';

import { SYMBOLS, INTERVALS, SP500 } from '../assets/constants';

import './radarscreen.styles.css';

const urlRealTime = 'https://api.tdameritrade.com/v1/marketdata/quotes';
const apikey = 'APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD';

const headerConst = ['Symbol', 'Interval', 'Price']

const selectTbl = {
	Symbol: SYMBOLS,
	Interval: INTERVALS
}

// const retrieveData = () => {

// 	const symbol = SYMBOLS;
// 	const params = {apikey, symbol};
	
// 	const queryExt = new URLSearchParams(params).toString();
// 	const queryString = urlRealTime.concat('?', queryExt);

// 	fetch(queryString)
// 		.then(response => response.json())
// 		.then(data => console.log(data))
// }

const fetchRealTimeData = async (symbol) => {
	const params = {apikey, symbol};
	
	const queryExt = new URLSearchParams(params).toString();
	const queryString = urlRealTime.concat('?', queryExt);

	const response = await fetch(queryString);

	if (!response.ok) {
		const message = `An error has occured: ${response.status}`;
		throw new Error(message);
	}

	const data = await response.json();

	return data;
}

class RadarScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			header: headerConst,
			Symbol: SP500.slice(0,8),
			Interval: Array(8).fill(INTERVALS[0]),
			Price: Array(8).fill(0)
		}
	}

	componentDidMount() {
		const { Symbol } = this.state;

		fetchRealTimeData(Symbol)
			.then(data => {
				const prices = Symbol.map((symbolName, index) => {
					return data[symbolName].lastPrice;
				})
				// console.log(prices);
				this.setState({
					Price: prices
				});
			})
	}

	onChange = (updatedValue, headerCol, valueRow) => {

		const stateKey = this.state.header[headerCol];
		const values = [...this.state[stateKey]];
		const prices = [...this.state.Price];

		values[valueRow] = updatedValue;

		// console.log('change', stateKey, updatedValue, this.state.header[headerCol], valueRow);
		
		let symbol = updatedValue, interval = updatedValue;
		if (stateKey==='Symbol') {
			interval = this.state.Interval[valueRow];
		}
		else if (stateKey==='Interval'){
			symbol = this.state.Symbol[valueRow];
		}

		// console.log('symbol', symbol, 'interval', interval);

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

	// onChange = key => (updatedValue, headerCol, valueRow) => {
	// 	// console.log('change', key, updatedValue, this.state.header[headerCol], valueRow);

	// 	const stateKey = this.state.header[headerCol];
	// 	const values = [...this.state[stateKey]];

	// 	// console.log('values',values, stateKey);
	// 	values[valueRow] = updatedValue;

	// 	// console.log('updatedValue',values);
	// 	// console.log('state', this.state[stateKey]);

	// 	this.setState({
	// 		[stateKey]: values
	// 	}
	// 	// , () => console.log('updated state',this.state[stateKey])
	// 	);
	// }

	render() {
	let i=0;

	const { header } = this.state;

		return(
			<div className="radarscreen">
				<div className='space'></div>
				
				<div id="grid-container">
					{
						header.map((value, colIdx) => {
							i++;
							return (
								<div 
									key={i} 
									id={i} 
									className='header'
									style={{ 
										gridRow: 1,
										gridColumn: colIdx+1}}
								>
									{value}
								</div>
							)
						})
					}
					
					{
						//loop through the header items (columns) and afterwards loop through stored values (rows)  
						header.map((value, colIdx) => this.state[value].map((rowVal,rowIdx) => {
								i++;
								if(selectTbl[header[colIdx]] !== undefined) {
									return (
										<Dropdown 
											options={selectTbl[header[colIdx]]}
											defaultValue={this.state[header[colIdx]][rowIdx]}
											style={{ 
												gridRow: rowIdx+2,
												gridColumn: colIdx+1}}
											key={i} 
											id={i} 
											// onChange={this.onChange(i)}
											onChange={this.onChange}
										/> 
									)
								}
								else {
									return (
										<div 
											key={i} 
											id={i} 
											className='item'
											style={{ 
												gridRow: rowIdx+2,
												gridColumn: colIdx+1}}
										>
											{rowVal.toFixed(2)}
										</div>
									)
								}
							})
						) 
					}
					
				</div>
		</div>
		)
	}
}


export default RadarScreen;