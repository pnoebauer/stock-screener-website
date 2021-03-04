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

// Symbol: SP500.slice(0,8),
// Interval: Array(8).fill(INTERVALS[0]),
// Price: Array(8).fill(0)

const createSymbolRow = (SymbolNames, Interval, Price) => {
	
	const rowArray = SymbolNames.map((value, index) => {
		return {
			Symbol: value,
			Interval: Interval[index],
			Price: Price[index],
			idx: index
		}
	});

	// console.log(rowArray)

	return rowArray;
}

class RadarScreen extends React.Component {
	constructor(props) {
		super(props);
		const Symbol = SP500.slice(0,8);
		const Interval = Array(8).fill(INTERVALS[0]);
		const Price = Array(8).fill(0);
		const symbolRow = createSymbolRow(Symbol, Interval, Price);

		this.state = {
			header: headerConst,
			symbolRow
		}

		// console.log(this.state)
	}

	componentDidMount() {
		// this.state.symbolRow.Symbol
		const { symbolRow } = this.state;
		const symbolNames = symbolRow.map(value => value.Symbol);
		// console.log(symbolNames);

		fetchRealTimeData(symbolNames)
			.then(data => {
				// const prices = Symbol.map((symbolName, index) => {
				// 	return data[symbolName].lastPrice;
				// })
				// console.log(prices);
				// this.setState({
				// 	Price: prices
				// });
				// return data[symbolName].lastPrice;

				const newSymbolRows = symbolNames.map((Symbol, index) => {
					const newSymbolRowObj = {
						...symbolRow[index],
						Symbol,
						Price: data[Symbol].lastPrice
					}
					// console.log(newSymbolRowObj,'newSymbolRowObj')
					return newSymbolRowObj
				})
				// console.log(newSymbolRows,'newSymbolRows')
			})
	}

	render() {
		return(
			<div className=""></div>
		)
	}
	// onChange = (updatedValue, headerCol, valueRow) => {

	// 	const stateKey = this.state.header[headerCol];
	// 	const values = [...this.state[stateKey]];
	// 	const prices = [...this.state.Price];

	// 	values[valueRow] = updatedValue;

	// 	// console.log('change', stateKey, updatedValue, this.state.header[headerCol], valueRow);
		
	// 	let symbol = updatedValue, interval = updatedValue;
	// 	if (stateKey==='Symbol') {
	// 		interval = this.state.Interval[valueRow];
	// 	}
	// 	else if (stateKey==='Interval'){
	// 		symbol = this.state.Symbol[valueRow];
	// 	}

	// 	// console.log('symbol', symbol, 'interval', interval);

	// 	fetchRealTimeData(symbol)
	// 		.then(data => {
	// 			const lastPrice = data[symbol].lastPrice;
	// 			// console.log(lastPrice);

	// 			prices[valueRow] = lastPrice;

	// 			// console.log(prices);

	// 			this.setState({
	// 				Price: prices
	// 			});

	// 		})
	// 		.catch(e => {
	// 			console.log('An error occurred during fetching: ' + e.message);
	// 	  	});


	// 	this.setState({
	// 		[stateKey]: values
	// 	});
	// }

	// render() {

	// 	const { header } = this.state;

	// 	console.log(this.state)

	// 	return(
	// 		<div className="radarscreen">
	// 			<div className='space'></div>
				
	// 			<div id="grid-container">
	// 				{
	// 					header.map((value, colIdx) => (
	// 							<ScreenHeader 
	// 								key={colIdx.toString()} 
	// 								gridColumn={colIdx+1}
	// 							>
	// 								{value}
	// 							</ScreenHeader>
	// 						)
	// 					)
	// 				}
					
	// 				{
	// 					//loop through the header items (columns) and afterwards loop through stored values (rows)  
	// 					header.map((value, colIdx) => this.state[value].map((rowVal,rowIdx) => {
	// 							if(selectTbl[header[colIdx]] !== undefined) {
	// 								return (
	// 									<Dropdown 
	// 										options={selectTbl[header[colIdx]]}
	// 										defaultValue={this.state[header[colIdx]][rowIdx]}
	// 										gridRow={rowIdx+2}
	// 										gridColumn={colIdx+1}
	// 										key={colIdx.toString()+rowIdx.toString()} 
	// 										onChange={this.onChange}
	// 									/> 
	// 								)
	// 							}
	// 							else {
	// 								return (
	// 									<ValueCell 
	// 										key={colIdx.toString()+rowIdx.toString()} 
	// 										gridRow={rowIdx+2}
	// 										gridColumn={colIdx+1}
	// 									>
	// 										{rowVal}
	// 									</ValueCell>
	// 								)
	// 							}
	// 						})
	// 					) 
	// 				}
					
	// 			</div>
	// 	</div>
	// 	)
	// }
}


export default RadarScreen;