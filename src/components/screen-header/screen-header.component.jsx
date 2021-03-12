import React from 'react';
import ScreenHeaderItem from '../screen-header-item/screen-header-item.component';

const ScreenHeader = ( { header, sortTable, sortConfig } ) => {
    const getClassNameForHeader = name => {
        if (!sortConfig) {
            return;
        }
        const direction = sortConfig.direction === 1 ? 'ascending' : 'descending'; 
        return sortConfig.sortedField === name ? direction : undefined;
    };

    return (
        <>
            {
                header.map((type, colIdx) => (
                        <ScreenHeaderItem 
                            key={colIdx.toString()} 
                            gridColumn={colIdx+1}
                            onSort={sortTable}
                            id={type}
                            className={`screen-header ${getClassNameForHeader(type)}`}
                        >
                            {type}
                        </ScreenHeaderItem>
                    )
                )
            }
        </>
    )
}

export default ScreenHeader;