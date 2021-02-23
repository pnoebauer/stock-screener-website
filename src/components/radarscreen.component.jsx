import React from 'react';

import Select from './select.component';
import Dropdown from './dropdown.component';

import './radarscreen.styles.css';


const arr = [['SPX', '@ES', '@NQ', 'SPY'],['Daily', 'Daily', '5 Min', 'Hourly'],[3, 6, 8, 0]]

const header = ['Symbol', 'Interval', 'Price']


const RadarScreen = () => {
	let i=0;

	return(
		<div className="radarscreen">
			<div className='space'>
			</div>

			
			
			{/* <div id="resizable">
			</div> */}
			<div id="grid-container">
				{header.map((value, colIdx) => {
					i++;
					console.log('b',value)
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
						console.log('c',header[colIdx]);
						header[colIdx] === 'Interval' ? console.log('int') : console.log('ni')
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
						)}
					)
				)}
				
				
				<Dropdown 
						options={['Daily', 'Hourly', '5 Min']}
						defaultValue='Daily'
						style={{ 
							gridRow: 2,
							gridColumn: 4,
						}}
						id='500'
						className='test'
					/>
				
				

				
				
				
			</div>
	</div>
	)
}

export default RadarScreen;