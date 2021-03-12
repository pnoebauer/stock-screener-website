import React from 'react';

import Dropdown from '../dropdown/dropdown.component';
import ValueCell from '../screen-value-cell/screen-value-cell.component';

import { SYMBOLS, INTERVALS } from '../../assets/constants';

const dropdownOptions = {
	Symbol: SYMBOLS,
	Interval: INTERVALS
}

const GenerateGridCell = ({ type, gridLocation, onChange, children }) => {

    const { rowIdx, colIdx } = gridLocation;

        if(dropdownOptions[type] !== undefined) {

            return (
                <Dropdown 
                    options={dropdownOptions[type]}
                    gridRow={rowIdx+2}
                    gridColumn={colIdx+1}
                    // key={colIdx.toString()+rowIdx.toString()} 
                    onChange={onChange}
                >
                    {children}
                </Dropdown> 
            )
        }
        else {
            return (
                <ValueCell 
                    // key={colIdx.toString()+rowIdx.toString()} 
                    gridRow={rowIdx+2}
                    gridColumn={colIdx+1}
                >
                    {children}
                </ValueCell>
            )
        }
    
}

export default GenerateGridCell;