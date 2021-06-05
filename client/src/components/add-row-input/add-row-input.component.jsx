import React from 'react';

import {connect} from 'react-redux';

import Dropdown from '../dropdown/dropdown.component';

import {SYMBOLS} from '../../assets/constants';

import {getStockNumber} from '../../redux/stockData/stockData.selectors';

import './add-row-input.styles.css';

const customStyles = {
	height: '30px',
	borderBottom: '1px solid black',
	borderLeft: '1px solid black',
	marginLeft: '-1px',
};

const AddRowInput = ({stockNumber, onRowAdd, numberSymbols}) => {
	return (
		<Dropdown
			options={SYMBOLS}
			gridRow={stockNumber + 2}
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

const mapStateToProps = state => ({
	stockNumber: getStockNumber(state),
});

export default connect(mapStateToProps)(AddRowInput);
