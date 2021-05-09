import React from 'react';

const ScreenHeaderItem = ({gridColumn, onSort, id, className, children}) => (
	<div style={{gridColumn}} onClick={onSort} id={id} className={className}>
		{children}
		<button
			style={{
				position: 'absolute',
				top: '0px',
				right: '0px',
				zIndex: 100,
			}}
			onClick={() => console.log('clicked')}
			name='configuration'
		>
			x
		</button>
	</div>
);

export default ScreenHeaderItem;
