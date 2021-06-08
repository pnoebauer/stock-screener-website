import React from 'react';

import {connect} from 'react-redux';

import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';
import AddRowInput from '../add-row-input/add-row-input.component';
import AddStockUniverseButton from '../add-stock-universe-button/add-stock-universe-button.component';
import DeleteAllRows from '../delete-all-rows/delete-all-rows.component';
import FilterSymbolsButton from '../filter-symbols-button/filter-symbols-button.component';

import {
	getStockNumber,
	getColumnNames,
	getStockData,
	getColumn,
	getNonCustomIndicators,
} from '../../redux/stockData/stockData.selectors';

import {getStocksPerUniverseCount} from '../../redux/stockData/statistics.selectors';

import {getFilteredStockNumber} from '../../redux/filtering/filtering.selectors';

import {doUpdateNonCustomIndicators} from '../../redux/stockData/stockData.actions';

import './radarscreen.styles.css';

const permanentHeaders = ['ID', 'Symbol', 'Interval'];

let updateKey = null;

class RadarScreen extends React.PureComponent {
	constructor(props) {
		super(props);
		this.events = undefined;
	}

	componentDidMount() {
		this.startEventSource();
	}

	componentDidUpdate(prevProps) {
		let sameElements = (arr1, arr2) =>
			[...arr1].sort().join() === [...arr2].sort().join(); //check if both arrays are equal (incl. duplicates)

		const symbolsUpdate = !sameElements(prevProps.symbols, this.props.symbols);
		const intervalsUpdate = !sameElements(prevProps.intervals, this.props.intervals);

		// API sends all indicators so the shown indicators on the screen do not affect the event source
		const apiIndicatorUpdate = !sameElements(
			prevProps.apiIndicators,
			this.props.apiIndicators
		);

		if (symbolsUpdate || intervalsUpdate || apiIndicatorUpdate) {
			// if (symbolsUpdate || intervalsUpdate) {
			// close old event source and start a new one with updated Symbol
			if (this.events) {
				// console.log('updating, closing eventSource', prevState.Symbol, this.state.Symbol);
				this.events.close();
				// console.log('update', this.events);
				this.startEventSource();
			}
		}
	}

	startEventSource() {
		const {updateNonCustomIndicators} = this.props;

		const uniqueSymbols = [...new Set(this.props.symbols)];
		// console.log('start new event source', uniqueSymbols);

		const url = `http://localhost:4000/events/symbols?id=${uniqueSymbols.join(',')}`;

		this.events = new EventSource(url);

		// Subscribe to all events without an explicit type
		this.events.onmessage = event => {
			const symbolsDataObject = JSON.parse(event.data);

			updateNonCustomIndicators(symbolsDataObject);
		};
	}

	componentWillUnmount() {
		if (this.events) {
			// console.log('unmounting, closing eventSource');
			this.events.close();
		}
	}

	render() {
		const {columnNames, stockNumber, filteredStockNumber} = this.props;

		console.log(this.props.stocksPerUniverseCount, 'stocksPerUniverseCount');

		updateKey = columnNames;

		return (
			<div className='radarscreen' style={{display: 'flex'}}>
				<div
					id='indexation-grid'
					style={{
						gridTemplateColumns: `1fr`,
						gridTemplateRows: `repeat(${filteredStockNumber + 1}, 1fr) 0`,
					}}
				>
					<div className='indexation' style={{position: 'sticky', top: '-1px'}}>
						#
					</div>
					{[...Array(filteredStockNumber)].map((s, index) => (
						<div className='indexation' key={index}>
							{index + 1}
						</div>
					))}
					<div className='indexation' id='number-symbols' key={stockNumber + 1}>
						{stockNumber + 1}
					</div>
				</div>

				<div
					id='grid-container'
					style={{
						gridTemplateColumns: `20px repeat(${columnNames.length}, 1fr)  0`,
						gridTemplateRows: `repeat(${filteredStockNumber + 1}, 1fr) 0 `,
					}}
				>
					<ScreenHeader />
					<AddStockUniverseButton
						style={{
							gridColumn: '1',
							gridRow: '1',
						}}
					/>
					<GenerateGrid />
					<AddRowInput gridRow={filteredStockNumber + 2} />
					<DeleteAllRows gridRow={filteredStockNumber + 2} />
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
						key={`${updateKey} filter`}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	stockNumber: getStockNumber(state),
	filteredStockNumber: getFilteredStockNumber(state),
	columnNames: getColumnNames(state),
	symbols: getColumn(state, 'Symbol'),
	intervals: getColumn(state, 'Interval'),
	apiIndicators: getNonCustomIndicators(state),
	stocksPerUniverseCount: getStocksPerUniverseCount(state),
});

const mapDispatchToProps = dispatch => ({
	updateNonCustomIndicators: apiDataObject =>
		dispatch(doUpdateNonCustomIndicators(apiDataObject)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RadarScreen);
