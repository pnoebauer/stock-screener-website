import React from 'react';

import './radarscreen.styles.css';

const arr = [[1, 2, 3, 4],[3, 6, 8, 0],['A', 'B', 'C', 'D']]

const RadarScreen = () => {
	let i=0;

	return(
		<div className="radarscreen">
			<div className='space'>
			</div>
			
			{/* <div id="resizable">
			</div> */}
			<div id="grid-container">
				{arr.map((value, colIdx) => value.map((rowVal,rowIdx) => {
						i++;
						return (
							<div 
								key={i} 
								id={i} 
								className='item'
								style={{ 
											gridRow: rowIdx+1,
											gridColumn: colIdx+1}}>
								{rowVal}
							</div>
						)}
					)
				)}
			</div>
	</div>
	)
}

export default RadarScreen;