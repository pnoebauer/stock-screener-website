import React from 'react';

import './add-row-input.styles.css';

import Dropdown from '../dropdown/dropdown.component';

import {SYMBOLS} from '../../assets/constants';

const AddRowInput = ({rowNumber, onRowAdd}) => {
	return (
		<Dropdown
			options={SYMBOLS}
			gridRow={rowNumber + 2}
			gridColumn={1}
			onChange={onRowAdd}
			customStyles={{
				height: '30px',
				borderBottom: '1px solid black',
				borderLeft: '1px solid black',
				marginLeft: '-1px',
			}}
			className={'add-row'}
		>
			{SYMBOLS[rowNumber]}
		</Dropdown>
	);
};

export default AddRowInput;
