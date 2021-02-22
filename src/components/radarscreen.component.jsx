import React from 'react';

import Select from './select.component';
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
				<div className=""
				style={{ 
					gridRow: 2,
					gridColumn: 4,
					backgroundColor: 'black'
				}}
				>
				<Select 
					options={['Daily', 'Hourly', '5 Min']}
					style={{ 
						gridRow: 2,
						gridColumn: 4,
						backgroundColor: 'black'
					}}
				>

				</Select>

				</div>
				

			</div>
	</div>
	)
}

export default RadarScreen;