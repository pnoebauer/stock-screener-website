// import React from 'react';

// import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';

// const GenerateGrid = ( { onChange, header, ...props} ) => {
    
//     const { Symbol } = props;
//     // console.log('map',header, Symbol)
//     return (
//         <>
//         {   
//             //loop through the header items (columns) and afterwards loop through stored values (rows)  
//             header.map((type, colIdx) => props[type].map((rowVal,rowIdx) => (
//                         <GenerateGridCell
//                             type={type}
//                             gridLocation={{rowIdx, colIdx}}
//                             onChange={onChange}
//                             key={`${Symbol[rowIdx]}-${type}-${rowIdx}`} 
//                             // id={`${Symbol[rowIdx]}-${type}-${rowIdx}`} 
//                         >
//                             {rowVal}
//                         </GenerateGridCell>
//                     )
//                 )
//             ) 
//         }
//         </>
//     )
// }

// export default GenerateGrid;


import React from 'react';

import GenerateGridCell from '../generate-grid-cell/generate-grid-cell.component';

const GenerateGrid = ( { onChange, header, ...props} ) => {
    
    const { Symbol } = props;
    const itemNum = Symbol.length;
    // console.log('map',header, Symbol)
    return (
        <>
        {   
            //loop through rows
            [...Array(itemNum)].map((value, rowIdx) => {
                    const rowValues = header.map((type, colIdx) => props[type][rowIdx]);
                    return (
                        <>
                            <GridRow 
                                rowValues={rowValues} 
                                rowIdx={rowIdx} 
                                header={header}
                                onChange={onChange}
                                key={rowIdx}
                            />
                        </>
                    )
                }
            )
        }
        </>
    )
}

const GridRow = ( { rowValues, rowIdx, header, onChange } ) => {
    // console.log(rowValues, rowIdx)
    return (
        <>
            {
                rowValues.map((value, colIdx) => {
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

export default GenerateGrid;