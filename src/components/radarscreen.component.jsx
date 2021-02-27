import React from 'react';

import Dropdown from './dropdown.component';

import { SYMBOLS, INTERVALS } from '../assets/constants';

import './radarscreen.styles.css';


const headerConst = ['Symbol', 'Interval', 'Price']

const selectTbl = {
	Symbol: SYMBOLS,
	Interval: INTERVALS
}

const retrieveData = () => {
	const url = 'https://api.tdameritrade.com/v1/marketdata/quotes';
	const apikey = 'APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD';

	const symbol = SYMBOLS;
	const params = {apikey, symbol};
	
	const queryExt = new URLSearchParams(params).toString();
	const queryString = url.concat('?', queryExt);

	fetch(queryString)
		.then(response => response.json())
		.then(data => console.log(data))

}

class RadarScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			header: headerConst,
			Symbol: ['SPX', '@ES', '@NQ', 'SPY'],
			Interval: ['Daily', 'Daily', '5 Min', 'Hourly'],
			Price: [3, 6, 8, 0]
		}
	}

	onChange = (updatedValue, headerCol, valueRow) => {

		const stateKey = this.state.header[headerCol];
		const values = [...this.state[stateKey]];
		values[valueRow] = updatedValue;

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
											{rowVal}
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