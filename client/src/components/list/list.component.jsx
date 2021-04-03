import React from 'react';

import './list.styles.css';

const List = ({ displayedItems, onToggle, className, headerName, style }) => {
	return (
		<div className='list-container' style={style}>
			<span>{headerName}</span>

			<ul className='list'>
				{displayedItems.map((item, index) => {
					return (
						<li
							key={item.id}
							id={item.id}
							onClick={onToggle}
							className={`${className} ${item.selected ? 'selected' : ''}`}
						>
							{item.name}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default List;
