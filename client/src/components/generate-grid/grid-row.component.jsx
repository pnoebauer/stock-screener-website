import React from 'react';

import {connect} from 'react-redux';

import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';
import DeleteRowButton from '../delete-row-button/delete-row-button.component';

import {getRowValues} from '../../redux/stockData/stockData.selectors';

const GridRow = ({
	rowValues,
	rowIdx,
	header,
	onChange,
	handleRowDelete,
	rowValueArray,
}) => {
	// console.log(rowValues, rowIdx, this.props.rowValueArray, 'red');
	// console.log(rowValueArray, 'grid row values redux');
	return (
		<>
			{rowValues.map((value, colIdx) => {
				// console.log('ggc',header[colIdx], value)
				return (
					<GenerateGridCell
						type={header[colIdx]}
						gridLocation={{rowIdx, colIdx}}
						onChange={onChange}
						key={header[colIdx]}
					>
						{value}
					</GenerateGridCell>
				);
			})}

			<DeleteRowButton rowIdx={rowIdx} handleRowDelete={handleRowDelete} />
		</>
	);
};

const mapStateToProps = (state, {rowIdx}) => {
	return {
		rowValueArray: getRowValues(state, rowIdx),
	};
};

export default connect(mapStateToProps)(GridRow);
