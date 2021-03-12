import React from 'react';

import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';

const GenerateGrid = ( { onChange, ...props} ) => {
    return (
        <>
        {
            //loop through the header items (columns) and afterwards loop through stored values (rows)  
            props.header.map((type, colIdx) => props[type].map((rowVal,rowIdx) => (
                        <GenerateGridCell
                            type={type}
                            gridLocation={{rowIdx, colIdx}}
                            onChange={onChange}
                            key={`${Symbol[rowIdx]}-${type}-${rowIdx}`} 
                        >
                            {rowVal}
                        </GenerateGridCell>
                    )
                )
            ) 
        }
        </>
    )
}

export default GenerateGrid;