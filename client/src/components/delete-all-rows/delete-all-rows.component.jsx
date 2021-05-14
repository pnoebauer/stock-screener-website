import React from 'react';

import {MdDeleteSweep} from 'react-icons/md';

import './delete-all-rows.styles.css';

const DeleteAllRows = ({handleDeleteAllRows, gridRow}) => (
	<button
		className='delete-all-rows'
		style={{
			gridColumn: '1',
			gridRow,
		}}
		onClick={handleDeleteAllRows}
	>
		<MdDeleteSweep className='delete-all-rows-icon' />
	</button>
);

export default DeleteAllRows;
