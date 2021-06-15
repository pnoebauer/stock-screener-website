import React from 'react';

import {connect} from 'react-redux';

import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';
import DeleteRowButton from '../delete-row-button/delete-row-button.component';

import {getRowValues} from '../../redux/stockData/stockData.selectors';
import {getColumnNames} from '../../redux/stockData/stockData.selectors';

const GridRow = ({rowIdx, stockDataIdx, rowValueArray, columnNames, columnOffset}) => {
	return (
		<>
			{rowValueArray.map((value, colIdx) => {
				// console.log(stockDataIdx, 'stockDataIdx');
				const gridRow = rowIdx + 2;
				const gridColumn = colIdx + columnOffset + 1; //use after correcting dropdown comp
				// const gridColumn = colIdx + columnOffset;
				return (
					<GenerateGridCell
						type={columnNames[colIdx]}
						gridRow={gridRow}
						gridColumn={gridColumn}
						key={columnNames[colIdx]}
						stockDataIdx={stockDataIdx}
					>
						{value}
					</GenerateGridCell>
				);
			})}

			<DeleteRowButton rowIdx={rowIdx} stockDataIdx={stockDataIdx} />
		</>
	);
};

const mapStateToProps = (state, {stockDataIdx}) => {
	return {
		rowValueArray: getRowValues(state, stockDataIdx),
		columnNames: getColumnNames(state),
	};
};

export default connect(mapStateToProps)(GridRow);
