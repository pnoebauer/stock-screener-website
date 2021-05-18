import React from 'react';

import ScreenHeader from '../screen-header/screen-header.component';
import GenerateGrid from '../generate-grid/generate-grid.component';
import AddColumnButton from '../add-column-button/add-column-button.component';
import AddRowInput from '../add-row-input/add-row-input.component';
import AddStockUniverseButton from '../add-stock-universe-button/add-stock-universe-button.component';
import DeleteAllRows from '../delete-all-rows/delete-all-rows.component';

import {
	INTERVALS,
	SYMBOLS,
	API_TO_INDICATORS,
	INDICATORS_TO_API,
	CUSTOM_INDICATORS,
} from '../../assets/constants';

import './radarscreen.styles.css';

const permanentHeaders = ['ID', 'Symbol', 'Interval'];

let updateKey = null;

class RadarScreen extends React.PureComponent {
	constructor(props) {
		super(props);
	}

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

		const {Symbol} = dataObject;

		const usedIndicators = headers.flatMap(item =>
			permanentHeaders.includes(item) ? [] : [item]
		);

		updateKey = headers;

		return (
			<div className='radarscreen' style={{display: 'flex'}}>
				<div
					id='indexation-grid'
					style={{
						gridTemplateColumns: `1fr`,
						gridTemplateRows: `repeat(${Symbol.length + 1}, 1fr) `,
					}}
				>
					<div className='indexation'>#</div>
					{Symbol.map((s, index) => (
						<div className='indexation' key={index}>
							{index + 1}
						</div>
					))}
				</div>
				<div
					id='grid-container'
					style={{
						gridTemplateColumns: `20px repeat(${headers.length}, 1fr) 0`,
						gridTemplateRows: `repeat(${Symbol.length + 1}, 1fr) 0`,
					}}
				>
					<ScreenHeader
						headers={headers}
						handleTableSorting={handleTableSorting}
						sortConfig={sortConfig}
						updateCustomIndicators={updateCustomIndicators}
						setAllIntervals={handleSetAllIntervals}
					/>
					<AddColumnButton
						style={{
							gridColumn: `${headers.length + 2}`,
						}}
						handleColumnUpdate={handleColumnUpdate}
						usedIndicatorsDefault={usedIndicators}
						key={updateKey}
					/>
					<GenerateGrid
						{...dataObject}
						header={headers}
						onChange={onChange}
						handleRowDelete={handleDeleteRow}
					/>
					<AddRowInput rowNumber={Symbol.length} onRowAdd={onRowAdd} />
					<AddStockUniverseButton
						style={{
							gridColumn: '1',
							gridRow: '1',
						}}
						handleUniverseAdd={handleUniverseAdd}
					/>
					<DeleteAllRows
						handleDeleteAllRows={handleDeleteAllRows}
						gridRow={Symbol.length + 2}
					/>
				</div>
			</div>
		);
	}
}

export default RadarScreen;
