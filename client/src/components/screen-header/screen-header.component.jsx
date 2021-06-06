import React from 'react';

import {connect} from 'react-redux';

import ScreenHeaderItem from '../screen-header-item/screen-header-item.component';

import {getColumnNames} from '../../redux/stockData/stockData.selectors';
import {getSortingConfiguration} from '../../redux/sorting/sorting.selectors';

import './screen-header.styles.css';

const ScreenHeader = ({
	headers,
	handleTableSorting,
	sortConfig,
	updateCustomIndicators,
	setAllIntervals,
}) => {
	const getClassNameForHeader = name => {
		if (!sortConfig) {
			return;
		}
		// const direction = sortConfig.direction === 1 ? 'ascending' : 'descending';
		let direction;

		if (sortConfig.direction === 1) {
			direction = 'ascending';
		} else if (sortConfig.direction === -1) {
			direction = 'descending';
		}

		return sortConfig.sortedField === name ? direction : undefined;
	};

	return (
		<>
			{headers.map((header, colIdx) => (
				<ScreenHeaderItem
					key={colIdx.toString()}
					gridColumn={colIdx + 2}
					// onSort={handleTableSorting}
					id={header}
					className={`screen-header ${getClassNameForHeader(header)}`}
					// updateCustomIndicators={updateCustomIndicators}
					setAllIntervals={setAllIntervals}
					headerName={header}
				/>
			))}
		</>
	);
};

const mapStateToProps = state => ({
	headers: getColumnNames(state),
	sortConfig: getSortingConfiguration(state),
});

export default connect(mapStateToProps)(ScreenHeader);
