import React from 'react';
import {render} from 'react-dom';
import Chart from './chart.component';
import {getData} from './utils';

import {TypeChooser} from 'react-stockcharts/lib/helper';

class ChartComponent extends React.Component {
	componentDidMount() {
		getData().then(data => {
			this.setState({data});
		});
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
		);
	}
}

export default ChartComponent;
