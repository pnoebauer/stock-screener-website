import React from 'react';

const ScreenHeader = ( { gridColumn, onSort, id, className, children } ) => (

    <div 
        // className='screen-header'
        style={{gridColumn}}
        onClick={e=>onSort(e)}
        id={id}
        className={className}
    >
        {children}
    </div>
)

export default ScreenHeader;