import React from 'react';

import Dropdown from '../dropdown/dropdown.component';
import ValueCell from '../screen-value-cell/screen-value-cell.component';

import {SYMBOLS, INTERVALS} from '../../assets/constants';

const dropdownOptions = {
	Symbol: SYMBOLS,
	Interval: INTERVALS,
};

// const GenerateGridCell = ({type, gridLocation, children}) => {
const GenerateGridCell = ({type, gridRow, gridColumn, stockDataIdx, children}) => {
	if (dropdownOptions[type] !== undefined) {
		return (
			<Dropdown
				options={dropdownOptions[type]}
				gridRow={gridRow}
				gridColumn={gridColumn}
				headerName={type}
				stockDataIdx={stockDataIdx}
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
