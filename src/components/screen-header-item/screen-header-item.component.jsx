import React from 'react';

const ScreenHeaderItem = ( { gridColumn, onSort, id, className, children } ) => (

    <div 
        // className='screen-header'
        style={{gridColumn}}
        onClick={onSort}
        id={id}
        className={className}
    >
        {children}
    </div>
)

export default ScreenHeaderItem;