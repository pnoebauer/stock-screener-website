import React from 'react';

import { SYMBOLS, INTERVALS, SP500 } from '../../assets/constants';

const selectTbl = {
	Symbol: SYMBOLS,
	Interval: INTERVALS
}


// gridRow={rowIdx+2}
//     gridColumn={colIdx+1}
//     key={colIdx.toString()+rowIdx.toString()} 
//     onChange={this.onChange})

const GenerateGrid = ({ type, gridLocation, onChange, children }) => {

    const { rowIdx, colIdx } = gridLocation;

        if(selectTbl[type] !== undefined) {
                                            
            // if(colIdx === 0 && rowIdx === 0) console.log('dd pass',this.state[header[colIdx]][rowIdx])

            return (
                <Dropdown 
                    options={selectTbl[type]}
                    gridRow={rowIdx+2}
                    gridColumn={colIdx+1}
                    key={colIdx.toString()+rowIdx.toString()} 
                    onChange={this.onChange}
                >
                    {children}
                </Dropdown> 
            )
        }
        else {
            return (
                <ValueCell 
                    key={colIdx.toString()+rowIdx.toString()} 
                    gridRow={rowIdx+2}
                    gridColumn={colIdx+1}
                >
                    {children}
                </ValueCell>
            )
        }
    
}

export default GenerateGrid;