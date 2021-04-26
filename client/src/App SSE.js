import React from 'react';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.events = undefined;
		this.state = {
			symbols: {},
			symbolList: ['GOOGL', 'AAPL', 'AMZN', 'MSFT'],
		};
	}

	componentDidMount() {
		this.startEventSource();
	}

	componentDidUpdate(prevProps, prevState) {
		// if (prevState.symbolList !== this.state.symbolList) {
		//   console.log('symbolList state has changed.')
		// }

		// let contained = (arr, target) => target.every(v => arr.includes(v)); //does arr contain all elements of target
		// console.log([...a].sort().join() === [...b].sort().join());

		// if (!contained(prevState.symbolList, this.state.symbolList)) {
		// 	// close old event source and start a new one with updated symbolList
		// }

		let arrayElementsEqual = (arr1, arr2) =>
			[...new Set(arr1)].sort().join() === [...new Set(arr2)].sort().join(); //check if both arrays contain same values (excl. duplicates)

		if (!arrayElementsEqual(prevState.symbolList, this.state.symbolList)) {
			// close old event source and start a new one with updated symbolList
			if (this.events) {
				console.log('updating, closing eventSource');
				this.events.close();
			}

			this.startEventSource();
		}
	}

	startEventSource() {
		const uniqueSymbols = [...new Set(this.state.symbolList)];

		const url = `http://localhost:4000/events/symbols?id=${uniqueSymbols.join(',')}`;
		// http://localhost:4000/events/tag?id=SPY,AAPL,GOOGL
		// this.events = new EventSource('http://localhost:4000/events');
		this.events = new EventSource(url);

		// // Subscribe to event with type 'test'
		// this.events.addEventListener('test', function (event) {
		// 	console.log('event.data', event.data);
		// });

		// Subscribe to all events without an explicit type
		this.events.onmessage = event => {
			const symbols = JSON.parse(event.data);

			// console.log(symbols, 'symbols');

			if (Object.keys(symbols).length) {
				// console.log('set state after message');
				this.setState({symbols});
			}

			// console.log('symbols A', this.state.symbols);
		};
	}

	addSymbol = () => {
		this.setState(prevState => ({
			symbolList: [...prevState.symbolList, 'AMD'],
		}));
	};

	componentWillUnmount() {
		if (this.events) {
			console.log('unmounting, closing eventSource');
			this.events.close();
		}
	}

	render() {
		const {symbols} = this.state;
		return (
			<div>
				{/* {console.log('symbols', symbols)} */}
				<ul>
					{Object.keys(symbols).map((symbol, index) => {
						// console.log(symbol);
						return (
							<li key={index}>
								{`${symbols[symbol].symbol}: ${symbols[symbol].closePrice}`}
							</li>
						);
					})}
				</ul>
				<button onClick={this.addSymbol}>add</button>
			</div>
		);
	}
}

export default App;
