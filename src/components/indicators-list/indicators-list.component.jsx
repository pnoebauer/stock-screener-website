import React from 'react';

import './indicators-list.styles.css';

const IndicatorsList = ( { displayedIndicators, onToggle, className }) => {
    return (
        <ul className="indicators-list">
            {displayedIndicators.map((item,index) => {
                return (
                    <li 
                        key={item.id}
                        id={index}
                        onClick={onToggle}
                        className={`${className} ${item.selected ? 'selected' : ''}`}
                    >
                        {item.name}
                    </li>
                )
            })}
            
        </ul>
    )
}

export default IndicatorsList;