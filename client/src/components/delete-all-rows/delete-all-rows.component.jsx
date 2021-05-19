import React from 'react';

import {MdDeleteSweep} from 'react-icons/md';

import Tooltip from '../tooltip/tooltip.component';

import './delete-all-rows.styles.css';

const DeleteAllRows = ({handleDeleteAllRows, gridRow}) => (
	<button
		className='delete-all-rows tooltip'
		style={{
			gridColumn: '1',
			gridRow,
		}}
		onClick={handleDeleteAllRows}
	>
		<MdDeleteSweep className='delete-all-rows-icon' />
		<Tooltip tooltipText={'Click to delete all symbols'} position={'right'} />
	</button>
);

export default DeleteAllRows;
