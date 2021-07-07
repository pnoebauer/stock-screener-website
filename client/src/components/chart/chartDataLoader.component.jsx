import React from 'react';
import {render} from 'react-dom';
import Chart from './chart.component';
import {getData} from './utils';

import {TypeChooser} from 'react-stockcharts/lib/helper';

import {SYMBOLS} from '../../assets/constants';

import './chart.styles.css';

class ChartComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			symbol: 'GOOGL',
			samplePeriod: 'day',
		};
	}
	async componentDidMount() {
		// getData().then(data => {
		// 	console.log({data});
		// 	this.setState({data});
		// });
		await this.loadData(new Date());
	}

	loadData = async endDate => {
		const {symbol, samplePeriod} = this.state;
		const requestObj = {
			symbol,
			lookBack: 300,
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
			// console.log({data}, 'backend');

			// newData = newData.map(candle => ({...candle, date: new Date(candle.date)}));

			// console.log({newData}, 'backend mapped');

			// this.setState({data: newData});

			this.setState(
				{
					data: [
						...newData.map(candle => ({...candle, date: new Date(candle.date)})),
						...this.state.data,
					],
				}
				// () => console.log({data: this.state.data})
			);
		} catch (error) {
			console.log({error});
		}
	};

	onChange = e => {
		console.log(e.target.value);
	};

	onClick = e => {
		console.log(e, 'clicked');
	};
	render() {
		console.log({SYMBOLS});
		if (this.state.data.length === 0) {
			return <div>Loading...</div>;
		}
		return (
			<>
				{/* <TypeChooser>
					{type => <Chart type={type} data={this.state.data} width={1600} />}
				</TypeChooser> */}
				<div className='chart-settings'>
					<input
						list='symbols'
						name='stock-symbol'
						id='stock-symbol'
						onChange={this.onChange}
						placeholder={this.state.symbol}
					/>
					<datalist id='symbols'>
						{SYMBOLS.map(stockName => (
							<option value={stockName} onClick={this.onClick}>
								{stockName}
							</option>
						))}
					</datalist>
				</div>
				<Chart
					type={'svg'}
					data={this.state.data}
					width={1200}
					height={600}
					loadData={this.loadData}
				/>
			</>
		);
	}
}

export default ChartComponent;
