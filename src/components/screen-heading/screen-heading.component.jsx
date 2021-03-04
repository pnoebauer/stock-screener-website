import React from 'react';

const ScreenHeader = ( { gridColumn, children } ) => (

    <div 
        className='screen-header'
        style={{gridColumn}}
    >
        {children}
    </div>
)

export default ScreenHeader;