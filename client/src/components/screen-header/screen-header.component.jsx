import React from 'react';

import {connect} from 'react-redux';

import ScreenHeaderItem from '../screen-header-item/screen-header-item.component';

import {getColumnNames} from '../../redux/stockData/stockData.selectors';
import {getSortingConfiguration} from '../../redux/sorting/sorting.selectors';

import './screen-header.styles.css';

const ScreenHeader = ({headers, columnOffset, sortConfig}) => {
	const getClassNameForHeader = name => {
		if (!sortConfig) {
			return;
		}

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
					gridColumn={colIdx + 1 + columnOffset}
					className={`screen-header ${getClassNameForHeader(header)}`}
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
