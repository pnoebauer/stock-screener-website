import React from 'react';

import {
	SYMBOLS,
	// , SP500, NAS100, DJ30
} from '../../assets/constants';

// function sleep(milliseconds) {
// 	const date = Date.now();
// 	let currentDate = null;
// 	do {
// 		currentDate = Date.now();
// 	} while (currentDate - date < milliseconds);
// }

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

class TestFetch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			unavailableSymbols: [],
		};
	}
	async componentDidMount() {
		for (let index = 0; index < SYMBOLS.length; index++) {
			// for (let index = 0; index < SYMBOLS.slice(0, 60).length; index++) {
			const symbol = SYMBOLS[index];
			const obj = await this.props.fetchRealTimeData([symbol], ['closePrice']);
			console.log('obj', obj, symbol, index);
			if (!obj) {
				this.setState(prevState => ({
					unavailableSymbols: [...prevState.unavailableSymbols, symbol],
				}));
				console.log('NA', symbol, index);
			}
			const sleepTime = (index + 1) % 20 === 0 ? 30000 : 0;
			// console.log(sleepTime, index, index % 5, 'sleep set');
			if (sleepTime > 0) console.log('waited', sleepTime, index);
			await sleep(sleepTime);
		}
	}

	render() {
		// console.log('props', this.props,this.props.sortConfig,'this.props.sortConfig')
		return (
			<div className=''>
				Unavailable symbols:
				<ul>
					{this.state.unavailableSymbols.map((symbol, index) => (
						<li key={index}>{symbol}</li>
					))}
				</ul>
			</div>
		);
	}
}

export default TestFetch;
