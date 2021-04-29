import React from 'react';

import GridRow from './grid-row.component';

const GenerateGrid = ({onChange, handleRowDelete, header, ...props}) => {
	const {Symbol} = props;
	const itemNum = Symbol.length;
	// console.log('map', header, Symbol, props);
	return (
		<>
			{
				//loop through rows
				[...Array(itemNum)].map((val, rowIdx) => {
					const rowValues = header.map(type => props[type][rowIdx] || '...');

					return (
						<GridRow
							rowValues={rowValues}
							rowIdx={rowIdx}
							header={header}
							onChange={onChange}
							handleRowDelete={handleRowDelete}
							key={props.ID[rowIdx]}
						/>
					);
				})
			}
		</>
	);
};

// class GenerateGrid extends React.PureComponent {
// 	render() {
// 		const {onChange, handleRowDelete, header, ...remProps} = this.props;
// 		const {Symbol} = remProps;
// 		const itemNum = Symbol.length;
// 		// console.log('map', header, Symbol);
// 		return (
// 			<>
// 				{
// 					//loop through rows
// 					[...Array(itemNum)].map((val, rowIdx) => {
// 						const rowValues = header.map(type => remProps[type][rowIdx] || '...');

// 						return (
// 							<GridRow
// 								rowValues={rowValues}
// 								rowIdx={rowIdx}
// 								header={header}
// 								onChange={onChange}
// 								handleRowDelete={handleRowDelete}
// 								key={remProps.ID[rowIdx]}
// 							/>
// 						);
// 					})
// 				}
// 			</>
// 		);
// 	}
// }

export default GenerateGrid;
