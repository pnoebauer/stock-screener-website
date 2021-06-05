import React from 'react';

import Dropdown from '../dropdown/dropdown.component';
import ValueCell from '../screen-value-cell/screen-value-cell.component';

import {SYMBOLS, INTERVALS} from '../../assets/constants';

const dropdownOptions = {
	Symbol: SYMBOLS,
	Interval: INTERVALS,
};

const GenerateGridCell = ({type, gridLocation, onChange, children}) => {
	const {rowIdx, colIdx} = gridLocation;
	const gridRow = rowIdx + 2;
	const gridColumn = colIdx + 1;

	if (dropdownOptions[type] !== undefined) {
		return (
			<Dropdown
				options={dropdownOptions[type]}
				gridRow={gridRow}
				gridColumn={gridColumn}
				// onChange={onChange}
				headerName={type}
			>
				{children}
			</Dropdown>
		);
	} else {
		return (
			<ValueCell gridRow={gridRow} gridColumn={gridColumn}>
				{children}
			</ValueCell>
		);
	}
};

export default GenerateGridCell;
