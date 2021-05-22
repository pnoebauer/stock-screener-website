import React from 'react';

import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';
import AddRowInput from '../add-row-input/add-row-input.component';
import AddStockUniverseButton from '../add-stock-universe-button/add-stock-universe-button.component';
import DeleteAllRows from '../delete-all-rows/delete-all-rows.component';
import FilterSymbolsButton from '../filter-symbols-button/filter-symbols-button.component';

import './radarscreen.styles.css';

const permanentHeaders = ['ID', 'Symbol', 'Interval'];

let updateKey = null;

class RadarScreen extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			// filterRules: [],
			// filterRules: {},
		};
	}

	updateFilterRules = filterRules => {
		this.setState({filterRules});
	};

	componentDidUpdate(prevProps) {
		let sameElements = (arr1, arr2) =>
			[...arr1].sort().join() === [...arr2].sort().join(); //check if both arrays are equal (incl. duplicates)

		// console.log(
		// 	'same',
		// 	sameElements(Object.keys(prevProps.dataObject), Object.keys(this.props.dataObject)),
		// 	prevProps.dataObject,
		// 	this.props.dataObject
		// );

		if (
			!sameElements(Object.keys(prevProps.dataObject), Object.keys(this.props.dataObject))
		) {
			this.setState({filterRules: undefined});
		}
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
		const {filterRules} = this.state;

		// filterRules.forEach(rule => {
		// 	const {operator, indicatorLH, indicatorRH} = rule;

		// 	console.log(dataObject[indicatorLH], 'lh');
		// });

		// console.log(Object.keys(filterRules).length, filterRules, 'l');

		let filteredObject = {};

		if (filterRules && Object.keys(filterRules).length) {
			let {operator, indicatorLH, indicatorRH} = filterRules;

			// console.log(dataObject[indicatorLH], 'lh');
			// console.log(dataObject[indicatorRH], 'rh');

			if (dataObject && dataObject[indicatorLH] && dataObject[indicatorRH]) {
				// console.log('valid');

				Object.keys(dataObject).forEach(indicator => {
					filteredObject[indicator] = dataObject[indicator].filter((value, index) => {
						return operatorFunction[operator](
							dataObject[indicatorLH][index],
							dataObject[indicatorRH][index]
						);
					});
				});

				// console.log(filteredObject, 'filteredObject');

				return filteredObject;
			}
		}

		return dataObject;
	};

	render() {
		// passed from the withSort HOC
		const {sortConfig} = this.props;

		const {
			handleTableSorting,
			updateCustomIndicators,
			handleSetAllIntervals,
			handleColumnUpdate,
			onChange,
			handleDeleteRow,
			onRowAdd,
			handleUniverseAdd,
			handleDeleteAllRows,
			headers,
			dataObject,
		} = this.props;

		const emptyFilter = this.state.filterRules === undefined ? true : false;

		const usedIndicators = headers.flatMap(item =>
			permanentHeaders.includes(item) ? [] : [item]
		);

		updateKey = headers;

		const filteredData = this.filteredDataObject();
		// console.log(filteredData, 'filteredData');

		const {Symbol} = filteredData;

		return (
			<div className='radarscreen' style={{display: 'flex'}}>
				<div
					id='indexation-grid'
					style={{
						gridTemplateColumns: `1fr`,
						gridTemplateRows: `repeat(${Symbol.length + 1}, 1fr) 0`,
					}}
				>
					<div className='indexation' style={{position: 'sticky', top: '-1px'}}>
						#
					</div>
					{Symbol.map((s, index) => (
						<div className='indexation' key={index}>
							{index + 1}
						</div>
					))}
				</div>

				<div
					id='grid-container'
					style={{
						gridTemplateColumns: `20px repeat(${headers.length}, 1fr)  0`,
						gridTemplateRows: `repeat(${Symbol.length + 1}, 1fr) 0 `,
					}}
				>
					<ScreenHeader
						headers={headers}
						handleTableSorting={handleTableSorting}
						sortConfig={sortConfig}
						updateCustomIndicators={updateCustomIndicators}
						setAllIntervals={handleSetAllIntervals}
					/>
					{/* <div
						className='table-buttons-container'
						style={{
							gridColumn: `${headers.length + 2}`,
							gridRow: '1',
						}}
					>
						<AddColumnButton
							handleColumnUpdate={handleColumnUpdate}
							usedIndicatorsDefault={usedIndicators}
							key={updateKey}
						/>
						<FilterSymbolsButton
							updateFilterRules={this.updateFilterRules}
							usedIndicators={usedIndicators}
							key={`${updateKey} filter`}
							// emptyFilter={emptyFilter}
						/>
					</div> */}
					{/* <AddColumnButton
						style={{
							gridColumn: `${headers.length + 2}`,
							gridRow: '1',
						}}
						handleColumnUpdate={handleColumnUpdate}
						usedIndicatorsDefault={usedIndicators}
						key={updateKey}
					/> */}
					{/* 
					<FilterSymbolsButton
						style={{
							gridColumn: `${headers.length + 3}`,
							gridRow: '1',
						}}
						updateFilterRules={this.updateFilterRules}
						usedIndicators={usedIndicators}
						key={`${updateKey} filter`}
					/> */}
					<AddStockUniverseButton
						style={{
							gridColumn: '1',
							gridRow: '1',
						}}
						handleUniverseAdd={handleUniverseAdd}
					/>
					<GenerateGrid
						{...filteredData}
						header={headers}
						onChange={onChange}
						handleRowDelete={handleDeleteRow}
					/>
					<AddRowInput rowNumber={Symbol.length} onRowAdd={onRowAdd} />
					<DeleteAllRows
						handleDeleteAllRows={handleDeleteAllRows}
						gridRow={Symbol.length + 2}
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
						handleColumnUpdate={handleColumnUpdate}
						usedIndicatorsDefault={usedIndicators}
						key={updateKey}
					/>
					<FilterSymbolsButton
						style={{
							gridColumn: `2`,
							gridRow: '1',
						}}
						updateFilterRules={this.updateFilterRules}
						usedIndicators={usedIndicators}
						key={`${updateKey} filter`}
						emptyFilter={emptyFilter}
					/>
				</div>
			</div>
		);
	}
}

export default RadarScreen;
