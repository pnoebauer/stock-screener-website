import React from 'react';

import {connect} from 'react-redux';

import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';
import AddRowInput from '../add-row-input/add-row-input.component';
import AddStockUniverseButton from '../add-stock-universe-button/add-stock-universe-button.component';
import DeleteAllRows from '../delete-all-rows/delete-all-rows.component';
import FilterSymbolsButton from '../filter-symbols-button/filter-symbols-button.component';

import {getStockNumber, getColumnNames} from '../../redux/stockData/stockData.selectors';

// import {UNIVERSES} from '../../assets/constants';

import './radarscreen.styles.css';

const permanentHeaders = ['ID', 'Symbol', 'Interval'];

let updateKey = null;

class RadarScreen extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			rules: [],
		};
	}

	updateFilterRules = rules => {
		this.setState(rules);
	};

	componentDidUpdate(prevProps) {
		let sameElements = (arr1, arr2) =>
			[...arr1].sort().join() === [...arr2].sort().join(); //check if both arrays are equal (incl. duplicates)

		if (
			!sameElements(Object.keys(prevProps.dataObject), Object.keys(this.props.dataObject))
		) {
			// this.setState({rules: undefined});

			this.setState({rules: []});
		}

		// if (!sameElements(prevProps.dataObject.Symbol, this.props.dataObject.Symbol)) {
		// 	console.log('symbols changed');

		// 	let symbolCount = {};

		// 	Object.keys(UNIVERSES).forEach(universe => {
		// 		let count = 0;
		// 		for (const symbol of this.props.dataObject.Symbol) {
		// 			if (UNIVERSES[universe].includes(symbol)) {
		// 				count++;
		// 			}
		// 		}
		// 		symbolCount[universe] = count;
		// 	});

		// 	console.log(symbolCount, 'symbolCount');
		// }
	}

	filteredDataObject = () => {
		const operatorFunction = {
			'=': (a, b) => a === b,
			'>': (a, b) => a > b,
			'>=': (a, b) => a >= b,
			'<': (a, b) => a < b,
			'<=': (a, b) => a <= b,
		};

		const {dataObject} = this.props;
		const {rules} = this.state;

		let filteredObject = {};

		if (rules.length && dataObject) {
			Object.keys(dataObject).forEach(indicator => {
				filteredObject[indicator] = dataObject[indicator].filter((value, index) => {
					let pass = true;

					for (let i = 0; i < rules.length; i++) {
						const rule = rules[i];
						const {operator, indicatorLH, indicatorRH} = rule;

						// if the selected indicators do not exist in the table then do not filter that row
						if (!dataObject[indicatorLH] && !dataObject[indicatorRH]) {
							return true;
						}

						if (
							!operatorFunction[operator](
								dataObject[indicatorLH][index],
								dataObject[indicatorRH][index]
							)
						) {
							pass = false;
							break;
						}
					}

					return pass;
				});
			});

			// console.log('filter', filteredObject);

			return filteredObject;
		}

		return dataObject;
	};

	render() {
		// passed from the withSort HOC
		// const {sortConfig} = this.props;

		const {
			// handleTableSorting,
			// updateCustomIndicators,
			handleSetAllIntervals,
			// handleColumnUpdate,
			// onChange,
			// handleDeleteRow,
			// onRowAdd,
			handleUniverseAdd,
			// handleDeleteAllRows,
			// headers,
			dataObject,
		} = this.props;

		// const emptyFilter = this.state.rules === undefined ? true : false;

		const {columnNames} = this.props;

		// const usedIndicators = headers.flatMap(item =>
		// 	permanentHeaders.includes(item) ? [] : [item]
		// );

		// updateKey = headers;
		updateKey = columnNames;

		const filteredData = this.filteredDataObject();
		// console.log(filteredData, 'filteredData');

		const {Symbol} = filteredData;

		const {stockNumber} = this.props;

		return (
			<div className='radarscreen' style={{display: 'flex'}}>
				<div
					id='indexation-grid'
					style={{
						gridTemplateColumns: `1fr`,
						// gridTemplateRows: `repeat(${Symbol.length + 1}, 1fr) 0`,
						gridTemplateRows: `repeat(${stockNumber + 1}, 1fr) 0`,
					}}
				>
					<div className='indexation' style={{position: 'sticky', top: '-1px'}}>
						#
					</div>
					{/* {Symbol.map((s, index) => (
						<div className='indexation' key={index}>
							{index + 1}
						</div>
					))} */}
					{[...Array(stockNumber)].map((s, index) => (
						<div className='indexation' key={index}>
							{index + 1}
						</div>
					))}
					<div
						className='indexation'
						id='number-symbols'
						key={dataObject.Symbol.length + 1}
					>
						{dataObject.Symbol.length + 1}
					</div>
				</div>

				<div
					id='grid-container'
					style={{
						// gridTemplateColumns: `20px repeat(${headers.length}, 1fr)  0`,
						gridTemplateColumns: `20px repeat(${columnNames.length}, 1fr)  0`,
						// gridTemplateRows: `repeat(${Symbol.length + 1}, 1fr) 0 `,
						gridTemplateRows: `repeat(${stockNumber + 1}, 1fr) 0 `,
					}}
				>
					<ScreenHeader
						// headers={headers}
						// handleTableSorting={handleTableSorting}
						// sortConfig={sortConfig}
						// updateCustomIndicators={updateCustomIndicators}
						setAllIntervals={handleSetAllIntervals}
					/>
					<AddStockUniverseButton
						style={{
							gridColumn: '1',
							gridRow: '1',
						}}
						handleUniverseAdd={handleUniverseAdd}
					/>
					<GenerateGrid {...filteredData} />
					<AddRowInput
						// rowNumber={Symbol.length}
						// onRowAdd={onRowAdd}
						numberSymbols={dataObject.Symbol.length}
					/>
					<DeleteAllRows
						// handleDeleteAllRows={handleDeleteAllRows}
						// gridRow={Symbol.length + 2}
						gridRow={stockNumber + 2}
					/>
				</div>
				<div
					id='table-settings-grid'
					style={{
						gridTemplateColumns: `20px 20px`,
						gridTemplateRows: `40px`,
					}}
				>
					<AddColumnButton
						style={{
							gridColumn: `1`,
							gridRow: '1',
						}}
						key={updateKey}
					/>
					<FilterSymbolsButton
						style={{
							gridColumn: `2`,
							gridRow: '1',
						}}
						updateFilterRules={this.updateFilterRules}
						key={`${updateKey} filter`}
						// emptyFilter={emptyFilter}

						emptyFilter={!this.state.rules.length}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	stockNumber: getStockNumber(state),
	columnNames: getColumnNames(state),
});

export default connect(mapStateToProps)(RadarScreen);
