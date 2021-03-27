import React from 'react';

import './indicators-list.styles.css';

const IndicatorsList = ( { displayedIndicators, onToggle, className, headerName, style }) => {
    return (
        <div className="indicators-list-container" style={style}>
            <span>{headerName}</span>
            
        
        <ul className="indicators-list">
            {displayedIndicators.map((item,index) => {
                return (
                    <li 
                        key={item.id}
                        id={item.id}
                        onClick={onToggle}
                        className={`${className} ${item.selected ? 'selected' : ''}`}
                    >
                        {item.name}
                    </li>
                )
            })}
            
        </ul>

        </div>
    )
}

export default IndicatorsList;