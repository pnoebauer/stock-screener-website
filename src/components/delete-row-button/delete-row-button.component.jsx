import React from 'react';

import './delete-row-button.styles.css';

const DeleteRowButton = ( { rowIdx, handleRowDelete, children } ) => {
    
    return (
        <button 
            className="delete-row-button"
            style={{gridRow: rowIdx+2}}
            id={rowIdx}
            onClick={handleRowDelete}
        >
            {children}
        </button>
    )
}

export default DeleteRowButton;