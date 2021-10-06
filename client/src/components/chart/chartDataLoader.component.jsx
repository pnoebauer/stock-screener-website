import React from 'react';

import {connect} from 'react-redux';

import Chart from './chart.component';

import EditChartIndicatorsButton from '../edit-chart-indicators/edit-chart-indicators.component';
import AddChartIndicator from '../add-chart-indicator/add-chart-indicator.component';

import SpinButton from '../spin-button/spin-button.component';

import {getChartIndicatorConfigs} from '../../redux/chart/chart.selectors';

import {SYMBOLS, INTERVALS} from '../../assets/constants';

import './chart.styles.css';

class ChartComponent extends React.Component {
	constructor(props) {
		super(props);
		// this.selectionDisplay = React.createRef();

		const activeSymbol = sessionStorage.getItem('shownChartSymbol') || 'GOOGL';
		const activeChartPeriod = sessionStorage.getItem('activeChartPeriod') || 'day';

		this.state = {
			data: [],
			symbol: activeSymbol,
			samplePeriod: activeChartPeriod,
			shownValue: '',
			fetchedEndDate: undefined,
			width: window.innerWidth,
			mainChartHeight: 300,
			subChartHeight: 100,
		};
	}

	setWidth = () => {
		this.setState({width: window.innerWidth});
	};

	setHeight = e => {
		// this.setState({[e.target.name]: Number(e.target.value)}, () =>
		// 	console.log(this.state[e.target.name])
		// );
		this.setState({[e.target.name]: Number(e.target.value)});
	};

	async componentDidMount() {
		// console.log('mounting');
		// getData().then(data => {
		// 	console.log({data});
		// 	this.setState({data});
		// });
		await this.loadData(new Date());

		window.visualViewport.addEventListener('resize', this.setWidth);
	}

	componentWillUnmount() {
		window.visualViewport.removeEventListener('resize', this.setWidth);
	}

	async componentDidUpdate(prevProps, prevState) {
		if (
			prevState.symbol !== this.state.symbol ||
			prevState.samplePeriod !== this.state.samplePeriod
		) {
			this.setState({data: []});

			sessionStorage.setItem('shownChartSymbol', this.state.symbol);
			sessionStorage.setItem('activeChartPeriod', this.state.samplePeriod);

			await this.loadData(new Date());
		}
	}

	loadData = async endDate => {
		// console.log('loading', {endDate, data: this.state.data});
		const {symbol, samplePeriod, fetchedEndDate} = this.state;

		// console.log('--------------endDate === fetchedEndDate', endDate, fetchedEndDate);

		if (endDate === fetchedEndDate) {
			// console.log('already loaded', endDate);
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

			// console.log({newData});

			this.setState(
				{
					data: [
						...newData.map(candle => ({...candle, date: new Date(candle.date)})),
						...this.state.data,
					],
				}
				// () =>
				// console.log({data: this.state.data, fetchedEndDate: this.state.fetchedEndDate})
			);
		} catch (error) {
			console.log({error});
		}
	};

	onChange = e => {
		// console.log(e.target.value, 'change');
		this.setState({shownValue: e.target.value});
	};

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
					<div className='symbol-barperiod-select'>
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
					</div>

					<div className='chart-sizing-container'>
						<label className='chart-sizing-label'>Chart Heights</label>
						<SpinButton
							defaultValue={300}
							handleChange={this.setHeight}
							name={'mainChartHeight'}
							chartName={'main'}
						/>
						<SpinButton
							defaultValue={100}
							handleChange={this.setHeight}
							name={'subChartHeight'}
							chartName={'sub'}
						/>
					</div>

					<AddChartIndicator key={this.props.indicatorConfigurations.length} />
				</div>

				<Chart
					type={'svg'}
					data={this.state.data}
					stockSymbol={this.state.symbol}
					width={this.state.width * 1}
					mainChartHeight={this.state.mainChartHeight}
					subChartHeight={this.state.subChartHeight}
					loadData={this.loadData}
					key={this.state.symbol}
				/>
			</>
		);
	}
}

const mapStateToProps = state => ({
	indicatorConfigurations: getChartIndicatorConfigs(state),
});

export default connect(mapStateToProps)(ChartComponent);
