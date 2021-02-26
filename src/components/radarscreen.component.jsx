import React from 'react';

import Dropdown from './dropdown.component';

import { SYMBOLS, INTERVALS } from '../assets/constants';

import './radarscreen.styles.css';


const arr = [['SPX', '@ES', '@NQ', 'SPY'],['Daily', 'Daily', '5 Min', 'Hourly'],[3, 6, 8, 0]]

const header = ['Symbol', 'Interval', 'Price']


//tbl will be the state storing the data 
// const tbl = {
// 	Symbol: SYMBOLS,

// }

const selectTbl = {
	Symbol: SYMBOLS,
	Interval: INTERVALS
}


const RadarScreen = () => {
	let i=0;
	console.log(SYMBOLS)
	return(
		<div className="radarscreen">
			<div className='space'>
			</div>
			
			{/* <div id="resizable">
			</div> */}
			<div id="grid-container">
				{header.map((value, colIdx) => {
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
				})}
				{arr.map((value, colIdx) => value.map((rowVal,rowIdx) => {
						i++;
						console.log('c',header[colIdx], selectTbl[header[colIdx]]);
						// header[colIdx] === 'Interval' ? console.log('int') : console.log('ni')
						if(selectTbl[header[colIdx]] !== undefined) {
							return (
								// <div className=""></div>
								<Dropdown 
									options={selectTbl[header[colIdx]]}
									defaultValue={selectTbl[header[colIdx]][0]}
									style={{ 
										gridRow: rowIdx+2,
										gridColumn: colIdx+1}}
									key={i} 
									id={i} 
									className='item'
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
					}
					)
				)}
			</div>
	</div>
	)
}

export default RadarScreen;