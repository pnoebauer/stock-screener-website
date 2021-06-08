import React from 'react';

import {connect} from 'react-redux';

import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';
import DeleteRowButton from '../delete-row-button/delete-row-button.component';

import {getRowValues} from '../../redux/stockData/stockData.selectors';
import {getColumnNames} from '../../redux/stockData/stockData.selectors';
import {getFilteredData} from '../../redux/filtering/filtering.selectors';

const GridRow = ({rowIdx, stockDataIdx, rowValueArray, columnNames, filteredDataMap}) => {
	// console.log(rowIdx, stockDataIdx, filteredDataMap, 'grid row');
	// if (filteredDataMap.includes(stockDataIdx)) {
	return (
		<>
			{rowValueArray.map((value, colIdx) => {
				return (
					<GenerateGridCell
						type={columnNames[colIdx]}
						gridLocation={{rowIdx, colIdx}}
						key={columnNames[colIdx]}
					>
						{value}
					</GenerateGridCell>
				);
			})}

			<DeleteRowButton rowIdx={rowIdx} stockDataIdx={stockDataIdx} />
		</>
	);
	// } else {
	// 	return null;
	// }
};

const mapStateToProps = (state, {stockDataIdx}) => {
	return {
		rowValueArray: getRowValues(state, stockDataIdx),
		columnNames: getColumnNames(state),
		filteredDataMap: getFilteredData(state),
	};
};

export default connect(mapStateToProps)(GridRow);
