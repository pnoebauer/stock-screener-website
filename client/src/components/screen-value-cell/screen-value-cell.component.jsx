import React from 'react';

import './screen-value-cell.styles.css';

class ValueCell extends React.PureComponent {
	render() {
		const {gridColumn, gridRow, children} = this.props;

		return (
			<div
				className='value-cell'
				style={{
					gridColumn,
					gridRow,
				}}
			>
				{children.toLocaleString({maximumFractionDigits: 2})}
			</div>
		);
	}
}

export default ValueCell;
