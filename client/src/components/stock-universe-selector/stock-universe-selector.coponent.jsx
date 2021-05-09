import React from 'react';

import List from '../list/list.component';

import './stock-universe-selector.styles.css';

const UniverseSelector = ({displayedItems, onToggle, onAdd}) => {
	return (
		<div className='universe-selector'>
			<List
				displayedItems={displayedItems}
				onToggle={onToggle}
				className={'universes'}
				headerName={'Universe'}
				style={{width: '80%', marginTop: '20px'}}
			/>
			<div className='add-universe'>
				<button className='add-selection-button' onClick={onAdd}>
					Add selection
				</button>
			</div>
		</div>
	);
};

export default UniverseSelector;
