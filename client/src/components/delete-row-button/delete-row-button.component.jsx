import React from 'react';

import './delete-row-button.styles.css';

import {IoIosRemoveCircleOutline} from 'react-icons/io';

const DeleteRowButton = ({rowIdx, handleRowDelete}) => {
	return (
		<div
			className='delete-row-button'
			style={{gridRow: rowIdx + 2, position: 'relative'}}
			id={rowIdx}
			onClick={handleRowDelete}
		>
			<IoIosRemoveCircleOutline size='40px' className='delete-row-button-icon' />
		</div>
		// <div style={{gridRow: rowIdx + 2, position: 'relative'}}>x</div>
	);
};

export default DeleteRowButton;
