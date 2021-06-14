import React from 'react';

import {connect} from 'react-redux';

import Collapsible from '../collapsible/collapsible.component';

import {getStockNumber} from '../../redux/stockData/stockData.selectors';
import {getFilteredStockNumber} from '../../redux/filtering/filtering.selectors';
import {
	getStocksPerUniverseCount,
	getStocksPerUniverseFilteredCount,
} from '../../redux/stockData/statistics.selectors';

import '../../assets/constants';

import './statistics.styles.css';

const Statistics = ({
	stockNumber,
	filteredStockNumber,
	stocksPerUniverseCount,
	stocksPerUniverseFilteredCount,
}) => {
	// console.log(stocksPerUniverseCount, stocksPerUniverseFilteredCount, 'uni count');
	return (
		<Collapsible title={'Statistics'}>
			<div
				id='statistics-grid-container'
				style={{
					gridTemplateColumns: `2fr 1fr repeat(${
						Object.keys(stocksPerUniverseCount).length
					}, 1fr)  `,
					gridTemplateRows: `1fr 1fr 1fr`,
				}}
			>
				<div className='description-cell' style={{gridColumn: '1', gridRow: '1'}}>
					Count
				</div>
				<div className='description-cell' style={{gridColumn: '2', gridRow: '1'}}>
					Total
				</div>
				{Object.keys(stocksPerUniverseCount).map((universe, index) => (
					<div
						className='description-cell'
						style={{gridColumn: `${index + 3}`, gridRow: `1`}}
						key={universe}
					>
						{universe}
					</div>
				))}

				<div className='description-cell' style={{gridColumn: '1', gridRow: '2'}}>
					Before filtering
				</div>
				<div className='info-cell' style={{gridColumn: '2', gridRow: '2'}}>
					{stockNumber}
				</div>
				{Object.keys(stocksPerUniverseCount).map((universe, index) => (
					<div
						className='info-cell'
						style={{gridColumn: `${index + 3}`, gridRow: `2`}}
						key={`${index} unfiltered`}
					>
						{stocksPerUniverseCount[universe]}
					</div>
				))}

				<div className='description-cell' style={{gridColumn: '1', gridRow: '3'}}>
					After filtering
				</div>
				<div className='info-cell' style={{gridColumn: '2', gridRow: '3'}}>
					{filteredStockNumber}
				</div>
				{Object.keys(stocksPerUniverseFilteredCount).map((universe, index) => (
					<div
						className='info-cell'
						style={{gridColumn: `${index + 3}`, gridRow: `3`}}
						key={`${index} filtered`}
					>
						{stocksPerUniverseFilteredCount[universe]}
					</div>
				))}
			</div>
		</Collapsible>
	);
};

const mapStateToProps = state => ({
	stockNumber: getStockNumber(state),
	filteredStockNumber: getFilteredStockNumber(state),
	stocksPerUniverseCount: getStocksPerUniverseCount(state),
	stocksPerUniverseFilteredCount: getStocksPerUniverseFilteredCount(state),
});

export default connect(mapStateToProps)(Statistics);
