import React from 'react';

import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';
import DeleteRowButton from '../delete-row-button/delete-row-button.component';

const GridRow = ({rowValues, rowIdx, header, onChange, handleRowDelete}) => {
	// console.log(rowValues, rowIdx)
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

export default GridRow;
