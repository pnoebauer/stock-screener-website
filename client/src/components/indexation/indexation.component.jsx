import React from 'react';

import {connect} from 'react-redux';

import {getFilteredStockNumber} from '../../redux/filtering/filtering.selectors';

import './indexation.styles.css';

const Indexation = ({gridColumn, filteredStockNumber}) => {
	return (
		<>
			<div
				className='indexation'
				style={{position: 'sticky', top: '0', gridColumn: '1', gridRow: '1'}}
			>
				#
			</div>
			{[...Array(filteredStockNumber)].map((s, index) => (
				<div
					className='indexation'
					key={index}
					style={{
						gridColumn,
						gridRow: `${index + 2}`,
					}}
				>
					{index + 1}
				</div>
			))}
		</>
	);
};

const mapStateToProps = state => ({
	filteredStockNumber: getFilteredStockNumber(state),
});

export default connect(mapStateToProps)(Indexation);
