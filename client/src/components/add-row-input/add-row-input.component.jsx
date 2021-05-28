import React from 'react';

import './add-row-input.styles.css';

import Dropdown from '../dropdown/dropdown.component';

import {SYMBOLS} from '../../assets/constants';

const customStyles = {
	height: '30px',
	borderBottom: '1px solid black',
	borderLeft: '1px solid black',
	marginLeft: '-1px',
};

const AddRowInput = ({rowNumber, onRowAdd, numberSymbols}) => {
	return (
		<Dropdown
			options={SYMBOLS}
			gridRow={rowNumber + 2}
			gridColumn={1}
			onChange={onRowAdd}
			customStyles={customStyles}
			className={'add-row'}
			headerName={'Symbol'}
		>
			{SYMBOLS[numberSymbols]}
		</Dropdown>
	);
};

export default AddRowInput;
