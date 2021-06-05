// import React from 'react';

// import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';
// import DeleteRowButton from '../delete-row-button/delete-row-button.component';

// const GridRow = ({rowValues, rowIdx, header, onChange, handleRowDelete}) => {
// 	// console.log(rowValues, rowIdx, 'red');
// 	return (
// 		<>
// 			{rowValues.map((value, colIdx) => {
// 				return (
// 					<GenerateGridCell
// 						type={header[colIdx]}
// 						gridLocation={{rowIdx, colIdx}}
// 						onChange={onChange}
// 						key={header[colIdx]}
// 					>
// 						{value}
// 					</GenerateGridCell>
// 				);
// 			})}

// 			<DeleteRowButton rowIdx={rowIdx} handleRowDelete={handleRowDelete} />
// 		</>
// 	);
// };

// export default GridRow;

import React from 'react';

import {connect} from 'react-redux';

import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';
import DeleteRowButton from '../delete-row-button/delete-row-button.component';

import {getRowValues} from '../../redux/stockData/stockData.selectors';

const GridRow = ({
	rowIdx,
	header,
	onChange,
	handleRowDelete,
	rowValueArray,
	stockDataIdx,
}) => {
	// console.log(rowValues, rowIdx, this.props.rowValueArray, 'red');
	// console.log(rowValueArray, 'grid row values redux', stockDataIdx);
	return (
		<>
			{rowValueArray.map((value, colIdx) => {
				// console.log('ggc', header[colIdx], value);
				return (
					<GenerateGridCell
						type={header[colIdx]}
						gridLocation={{rowIdx, colIdx}}
						// onChange={onChange}
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

const mapStateToProps = (state, {stockDataIdx}) => {
	return {
		rowValueArray: getRowValues(state, stockDataIdx),
	};
};

export default connect(mapStateToProps)(GridRow);
