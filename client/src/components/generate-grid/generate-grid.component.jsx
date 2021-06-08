// import React from 'react';

// import GridRow from './grid-row.component';

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

import React from 'react';

import GridRow from './grid-row.component';
import {connect} from 'react-redux';

import {getSortingMap} from '../../redux/sorting/sorting.selectors';
import {getFilteredData} from '../../redux/filtering/filtering.selectors';
import {getFilteredSortingMap} from '../../redux/filtering/filtering.selectors';

// const GenerateGrid = ({sortingMap, filteredDataMap}) => {
// 	const filteredSortingMap = sortingMap.filter(value => filteredDataMap.includes(value));
const GenerateGrid = ({filteredSortingMap}) => {
	return (
		<>
			{
				//loop through rows
				filteredSortingMap &&
					filteredSortingMap.map((stockDataIdx, rowIdx) => {
						return (
							<GridRow stockDataIdx={stockDataIdx} rowIdx={rowIdx} key={stockDataIdx} />
						);
					})
			}
		</>
	);
};

const mapStateToProps = state => {
	return {
		// sortingMap: getSortingMap(state),
		// filteredDataMap: getFilteredData(state),
		filteredSortingMap: getFilteredSortingMap(state),
	};
};

export default connect(mapStateToProps)(GenerateGrid);
