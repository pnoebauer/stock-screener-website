import React from 'react';

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
		XX
	</button>
);

export default DeleteAllRows;
