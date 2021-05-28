import React from 'react';

import {connect} from 'react-redux';

import {IoIosRemoveCircleOutline} from 'react-icons/io';

import {doDeleteRow} from '../../redux/stockData/stockData.actions';

import './delete-row-button.styles.css';

const DeleteRowButton = ({rowIdx, handleRowDelete, removeRow}) => {
	const deleteRow = event => {
		removeRow(rowIdx);
		return handleRowDelete(event);
	};

	return (
		<div
			className='delete-row-button'
			style={{gridRow: rowIdx + 2, position: 'relative'}}
			id={rowIdx}
			onClick={deleteRow}
			// onClick={removeRow}
			// onClick={()=>removeRow(rowIdx)}
		>
			<IoIosRemoveCircleOutline size='40px' className='delete-row-button-icon' />
		</div>
	);
};

const mapDispatchToProps = dispatch => ({
	removeRow: rowIdx => dispatch(doDeleteRow(rowIdx)),
	// removeRow: e => dispatch(doDeleteRow(e.currentTarget.id)),
});

export default connect(null, mapDispatchToProps)(DeleteRowButton);
