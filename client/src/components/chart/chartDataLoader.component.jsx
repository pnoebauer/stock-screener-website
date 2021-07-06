import React from 'react';
import {render} from 'react-dom';
import Chart from './chart.component';
import {getData} from './utils';

import {TypeChooser} from 'react-stockcharts/lib/helper';

class ChartComponent extends React.Component {
	async componentDidMount() {
		// getData().then(data => {
		// 	console.log({data});
		// 	this.setState({data});
		// });

		const requestObj = {symbol: 'GOOGL', lookBack: 300, samplePeriod: 'week'};

		try {
			const response = await fetch('http://localhost:4000/chart', {
				method: 'POST', // *GET, POST, PUT, DELETE, etc.
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestObj), // body data type must match "Content-Type" header
			});

			let data = await response.json();
			console.log({data}, 'backend');

			data = data.map(candle => ({...candle, date: new Date(candle.date)}));

			this.setState({data});

			// return data;
		} catch (error) {
			console.log({error});
		}
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>;
		}
		return (
			// <TypeChooser>
			// 	{type => <Chart type={type} data={this.state.data} width={1600} />}
			// </TypeChooser>
			<Chart type={'svg'} data={this.state.data} width={1200} height={600} />
			// <div></div>
		);
	}
}

export default ChartComponent;
