import React from 'react';

const ValueCell = ( { gridColumn, gridRow, children } ) => (
    <div 
        className='value-cell'
        style={{
            gridColumn,
            gridRow
        }}
    >
        {children.toFixed(2)}
    </div>
)

export default ValueCell;