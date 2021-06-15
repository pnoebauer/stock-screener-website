import React from 'react';

import GridRow from './grid-row.component';
import {connect} from 'react-redux';

import {getFilteredSortingMap} from '../../redux/filtering/filtering.selectors';

const GenerateGrid = ({columnOffset, filteredSortingMap}) => {
	return (
		<>
			{
				//loop through rows
				filteredSortingMap &&
					filteredSortingMap.map((stockDataIdx, rowIdx) => {
						return (
							<GridRow
								stockDataIdx={stockDataIdx}
								columnOffset={columnOffset}
								rowIdx={rowIdx}
								key={stockDataIdx}
							/>
						);
					})
			}
		</>
	);
};

const mapStateToProps = state => {
	return {
		filteredSortingMap: getFilteredSortingMap(state),
	};
};

export default connect(mapStateToProps)(GenerateGrid);
