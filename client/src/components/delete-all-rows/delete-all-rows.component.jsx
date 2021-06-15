import React from 'react';

import {connect} from 'react-redux';

import {MdDeleteSweep} from 'react-icons/md';

import Tooltip from '../tooltip/tooltip.component';

import {doDeleteAllRows} from '../../redux/stockData/stockData.actions';

import './delete-all-rows.styles.css';

const DeleteAllRows = ({gridRow, gridColumn, removeAllRows}) => {
	return (
		<button
			className='delete-all-rows tooltip'
			style={{
				gridColumn,
				gridRow,
			}}
			onClick={removeAllRows}
		>
			<MdDeleteSweep className='delete-all-rows-icon' />
			<Tooltip tooltipText={'Click to delete all symbols'} position={'right'} />
		</button>
	);
};

const mapDispatchToProps = dispatch => ({
	removeAllRows: () => dispatch(doDeleteAllRows()),
});

export default connect(null, mapDispatchToProps)(DeleteAllRows);
