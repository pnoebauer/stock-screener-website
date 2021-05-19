import React from 'react';

import './screen-value-cell.styles.css';

class ValueCell extends React.PureComponent {
	render() {
		const {gridColumn, gridRow, children} = this.props;

		// console.log('render',gridColumn, gridRow,children)
		// console.log('render',children, typeof(children),children.toLocaleDateString())
		return (
			<div
				className='value-cell'
				style={{
					gridColumn: `${gridColumn + 1}`,
					gridRow,
				}}
			>
				{children.toLocaleString({maximumFractionDigits: 2})}
			</div>
		);
	}
}

export default ValueCell;
