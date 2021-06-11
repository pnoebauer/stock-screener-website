import React from 'react';

import {connect} from 'react-redux';

import {getStockNumber} from '../../redux/stockData/stockData.selectors';
import {getFilteredStockNumber} from '../../redux/filtering/filtering.selectors';
import {getStocksPerUniverseCount} from '../../redux/stockData/statistics.selectors';

import './statistics.styles.css';

const Statistics = ({stockNumber, filteredStockNumber}) => {
	return (
		<div
			id='statistics-grid-container'
			style={{
				gridTemplateColumns: `1fr 1fr`,
				gridTemplateRows: `1fr 1fr `,
			}}
		>
			{/* `repeat(${filteredStockNumber + 1}, 1fr) 0 ` */}
			<div className='description-cell' style={{gridColumn: '1', gridRow: '1'}}>
				Stocks screened
			</div>
			<div className='description-cell' style={{gridColumn: '1', gridRow: '2'}}>
				Stocks after filtering
			</div>

			<div className='info-cell' style={{gridColumn: '2', gridRow: '1'}}>
				{stockNumber}
			</div>
			<div className='info-cell' style={{gridColumn: '2', gridRow: '2'}}>
				{filteredStockNumber}
			</div>
		</div>
	);
};

const mapStateToProps = state => ({
	stockNumber: getStockNumber(state),
	filteredStockNumber: getFilteredStockNumber(state),
	stocksPerUniverseCount: getStocksPerUniverseCount(state),
});

export default connect(mapStateToProps)(Statistics);
