import React from 'react';

import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';


const GridRow = ( { rowValues, rowIdx, header, onChange } ) => {
    // console.log(rowValues, rowIdx)
    return (
        <>
            {
                rowValues.map((value, colIdx) => {
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
                    )
                })
            }
        </>
    )
}

export default GridRow;