import React from 'react';
// import {render} from 'react-dom';

import {getData} from './utils';

import {GrSettingsOption} from 'react-icons/gr';

import Chart from './chart.component';

// import Modal from '../portal-modal/modal.component';

// import IndicatorSelector from '../indicator-selector/indicator-selector.component';

import Tooltip from '../tooltip/tooltip.component';
import EditChartIndicatorsButton from '../edit-chart-indicators/edit-chart-indicators.component';

import {SYMBOLS, INTERVALS} from '../../assets/constants';

import './chart.styles.css';

class ChartComponent extends React.Component {
	constructor(props) {
		super(props);
		// this.selectionDisplay = React.createRef();
		this.state = {
			data: [],
			symbol: 'GOOGL',
			samplePeriod: 'day',
			shownValue: '',
			fetchedEndDate: undefined,
		};
	}
	async componentDidMount() {
		// getData().then(data => {
		// 	console.log({data});
		// 	this.setState({data});
		// });
		await this.loadData(new Date());
	}

	async componentDidUpdate(prevProps, prevState) {
		if (
			prevState.symbol !== this.state.symbol ||
			prevState.samplePeriod !== this.state.samplePeriod
		) {
			this.setState({data: []});

			await this.loadData(new Date());
		}
	}

	loadData = async endDate => {
		console.log('loading', {endDate, data: this.state.data});
		const {symbol, samplePeriod, fetchedEndDate} = this.state;

		console.log('--------------endDate === fetchedEndDate', endDate, fetchedEndDate);

		if (endDate === fetchedEndDate) {
			console.log('already loaded', endDate);
			return;
		}

		this.setState({fetchedEndDate: endDate});

		const requestObj = {
			symbol,
			lookBack: 5000,
			samplePeriod,
			endDate,
		};

		try {
			const response = await fetch('http://localhost:4000/chart', {
				method: 'POST', // *GET, POST, PUT, DELETE, etc.
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestObj), // body data type must match "Content-Type" header
			});

			let newData = await response.json();

			console.log({newData});

			this.setState(
				{
					data: [
						...newData.map(candle => ({...candle, date: new Date(candle.date)})),
						...this.state.data,
					],
				},
				() =>
					console.log({data: this.state.data, fetchedEndDate: this.state.fetchedEndDate})
			);
		} catch (error) {
			console.log({error});
		}
	};

	onChange = e => {
		console.log(e.target.value, 'change');
		this.setState({shownValue: e.target.value});
	};

	// onClick = e => {
	// 	// console.log(e, 'clicked');
	// 	// console.log(e.target, 'clicked');
	// 	console.log(e.target.name, e.target.value, e.target.key, 'clicked');
	// };

	onKeyUp = e => {
		// console.log(e.nativeEvent, this.state.shownValue, 'nativeEvent');
		// console.log(e.keyCode, 'target');

		if (e.nativeEvent.type === 'keyup' && e.keyCode === undefined) {
			// console.log('blurring');
			this.handleBlur(e);
		}

		if (e.keyCode === 13) {
			if (SYMBOLS.includes(this.state.shownValue)) {
				this.setState({symbol: this.state.shownValue});
				e.target.blur();
			}
		}
	};

	handleBlur = e => {
		e.preventDefault();

		// console.log('blur', this.state.shownValue);

		if (SYMBOLS.includes(this.state.shownValue)) {
			// console.log('exists click out');
			this.setState({symbol: this.state.shownValue});
			e.target.blur();
		} else {
			e.target.focus();
		}

		// console.log(e, 'blur');
	};

	selectionChange = event => {
		if (event.target.value !== this.state.samplePeriod)
			this.setState({samplePeriod: event.target.value});
	};

	render() {
		if (this.state.data.length === 0) {
			return <div>Loading...</div>;
		}
		return (
			<>
				<div className='chart-settings'>
					<input
						list='symbols'
						name='stock-symbol'
						id='stock-symbol'
						onChange={this.onChange}
						placeholder={this.state.symbol}
						onKeyUp={this.onKeyUp}
						onBlur={this.handleBlur}
					/>
					<datalist id='symbols'>
						{SYMBOLS.map(stockName => (
							<option key={stockName} value={stockName}>
								{stockName}
							</option>
						))}
					</datalist>

					<select
						value={this.state.samplePeriod}
						onChange={this.selectionChange}
						name='selector'
						className='interval-type-selector'
					>
						{INTERVALS.map((value, index) => (
							// console.log( value, 'v') ||
							<option value={value} key={index}>
								{value}
							</option>
						))}
					</select>
					<EditChartIndicatorsButton />
					{/* <button
						// onClick={this.show}
						className='chart-indicator-button tooltip'
						// style={this.props.style}
					>
						<GrSettingsOption className='chart-indicator-icon' />
						<Tooltip tooltipText={'Click to edit indicators'} position={'center'} />
					</button> */}
				</div>
				<Chart
					type={'svg'}
					data={this.state.data}
					stockSymbol={this.state.symbol}
					width={1200}
					height={600}
					loadData={this.loadData}
					key={this.state.symbol}
				/>
			</>
		);
	}
}

export default ChartComponent;
