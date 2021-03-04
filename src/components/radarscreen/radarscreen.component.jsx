import React from 'react';

import ScreenHeader from '../screen-heading/screen-heading.component';
import Dropdown from '../dropdown/dropdown.component';
import ValueCell from '../screen-value-cell/screen-value-cell.component';

import { SYMBOLS, INTERVALS, SP500 } from '../../assets/constants';

import './radarscreen.styles.css';

const urlRealTime = 'https://api.tdameritrade.com/v1/marketdata/quotes';
const apikey = 'APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD';

const headerConst = ['Symbol', 'Interval', 'Price']

const selectTbl = {
	Symbol: SYMBOLS,
	Interval: INTERVALS
}

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


const sortTableO = (list) => {
	// const list = [...this.state[sortedField]]
	
	console.log(list);

	// temporary array holds objects with position and sort-value
	const mapped = list.map((value, index) => {
		if(typeof(value) ==='string') value = value.toLowerCase();
		  
		return { 
			  index, 
			  value 
			};
		}
	);

	console.log(mapped);

	// sorting the mapped array containing the reduced values
	mapped.sort(function(a, b) {
		if (a.value > b.value) {
			return 1;
		}
		if (a.value < b.value) {
			return -1;
		}
		return 0;
	});

	console.log(mapped);

	// container for the resulting order
	const result = mapped.map(element => list[element.index]);

	console.log(result)
}


const sortTable = (stateClone, sortedField) => {
	
	const list = [...stateClone[sortedField]];
	
	console.log(list);

	// temporary array holds objects with position and sort-value
	const mapped = list.map((value, index) => {
		if(typeof(value) ==='string') value = value.toLowerCase();
		  
		return { 
			  index, 
			  value 
			};
		}
	);

	console.log(mapped);

	// sorting the mapped array containing the reduced values
	mapped.sort((a, b) => {
		if (a.value > b.value) {
			return 1;
		}
		if (a.value < b.value) {
			return -1;
		}
		return 0;
	});

	console.log(mapped);

	// container for the resulting order
	// const result = mapped.map(element => list[element.index]);

	const result = mapped.map(element => {
		// list[element.index]
		const Price = stateClone.Price[element.index];
		const Interval = stateClone.Interval[element.index]
		const Symbol = stateClone.Symbol[element.index]
		

		return {
			...stateClone,
			Price,
			Interval,
			Symbol
		}
	});

	console.log(result)
}


class RadarScreen extends React.PureComponent {
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
				}
				,
				// () => console.log(this.state)
				);
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

	render() {

		const { header } = this.state;

		const sortedField = 'Price';
		// const list = [...this.state[sortedField]]

		// sortTable(list);

		const stateClone = {...this.state};

		sortTable(stateClone, sortedField);

		// console.log(this.state);

		// const priceArr = [...this.state.Price]
		// priceArr.sort(function(a, b) {
		// 	return a - b;
		//   })

		// console.log(priceArr)

		return(
			<div className="radarscreen">
				<div className='space'></div>
				
				<div id="grid-container">
					{
						header.map((value, colIdx) => (
								<ScreenHeader 
									key={colIdx.toString()} 
									gridColumn={colIdx+1}
								>
									{value}
								</ScreenHeader>
							)
						)
					}
					
					{
						//loop through the header items (columns) and afterwards loop through stored values (rows)  
						header.map((value, colIdx) => this.state[value].map((rowVal,rowIdx) => {
								if(selectTbl[header[colIdx]] !== undefined) {
									return (
										<Dropdown 
											options={selectTbl[header[colIdx]]}
											defaultValue={this.state[header[colIdx]][rowIdx]}
											gridRow={rowIdx+2}
											gridColumn={colIdx+1}
											key={colIdx.toString()+rowIdx.toString()} 
											onChange={this.onChange}
										/> 
									)
								}
								else {
									return (
										<ValueCell 
											key={colIdx.toString()+rowIdx.toString()} 
											gridRow={rowIdx+2}
											gridColumn={colIdx+1}
										>
											{rowVal}
										</ValueCell>
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