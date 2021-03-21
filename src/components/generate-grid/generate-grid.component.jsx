import React from 'react';

import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';

const GenerateGrid = ( { onChange, header, ...props} ) => {
    // console.log('map',header, props)
    return (
        <>
        {   
            //loop through the header items (columns) and afterwards loop through stored values (rows)  
            header.map((type, colIdx) => props[type].map((rowVal,rowIdx) => (
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