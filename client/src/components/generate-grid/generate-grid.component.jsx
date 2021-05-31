import React from 'react';

import GridRow from './grid-row.component';

// const GenerateGrid = ({onChange, handleRowDelete, header, ...props}) => {
// 	const {Symbol} = props;
// 	const itemNum = Symbol.length;
// 	// console.log('map', header, Symbol, props);
// 	return (
// 		<>
// 			{
// 				//loop through rows
// 				[...Array(itemNum)].map((val, rowIdx) => {
// 					const rowValues = header.map(type => props[type][rowIdx] || '...');

// 					return (
// 						<GridRow
// 							rowValues={rowValues}
// 							rowIdx={rowIdx}
// 							header={header}
// 							onChange={onChange}
// 							handleRowDelete={handleRowDelete}
// 							key={props.ID[rowIdx]}
// 						/>
// 					);
// 				})
// 			}
// 		</>
// 	);
// };

// export default GenerateGrid;

import {connect} from 'react-redux';

import {getSortingMap} from '../../redux/sorting/sorting.selectors';

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

const mapStateToProps = state => {
	return {
		sortingMap: getSortingMap(state),
	};
};

export default connect(mapStateToProps)(GenerateGrid);
