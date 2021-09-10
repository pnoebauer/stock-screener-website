import React from 'react';

import './list.styles.css';

const List = ({displayedItems, onToggle, className, headerName, style}) => {
	// console.log({displayedItems});
	return (
		<div className='list-container' style={style}>
			<span>{headerName}</span>

			<ul className='list'>
				{displayedItems.map((item, index) => {
					return (
						<li
							key={item.id}
							id={item.id}
							// key={`${item.id} ${index}`}
							// id={`${item.id} ${index}`}
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
