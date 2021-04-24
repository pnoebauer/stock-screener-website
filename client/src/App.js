import React from 'react';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.events = undefined;
		this.state = {
			symbols: {},
			symbolList: ['GOOGL', 'AAPL', 'AMZN'],
		};
	}

	componentDidMount() {
		const url = `http://localhost:4000/events/symbols?id=${this.state.symbolList.join(
			','
		)}`;
		// console.log(url);
		this.startEventSource(url);
	}

	startEventSource(url) {
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

			console.log(symbols, 'symbols');

			this.setState({symbols});

			// console.log('symbols A', this.state.symbols);
		};
	}

	componentWillUnmount() {
		if (this.eventSource) this.eventSource.close();
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
							<li
								key={index}
							>{`${symbols[symbol].symbol}: ${symbols[symbol].closePrice}`}</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default App;

// import React, {useState, useEffect} from 'react';
// function App() {
// 	// const [facts, setFacts] = useState([]);
// 	const [symbols, setSymbols] = useState({});
// 	const [listening, setListening] = useState(false);

// 	useEffect(() => {
// 		if (!listening) {
// 			const events = new EventSource('http://localhost:4000/events');

// 			// Subscribe to event with type 'test'
// 			events.addEventListener('test', function (event) {
// 				console.log('event.data', event.data);
// 			});

// 			// Subscribe to all events without an explicit type
// 			events.onmessage = event => {
// 				const parsedData = JSON.parse(event.data);

// 				console.log(parsedData, 'parsedData');

// 				setSymbols(symbols => ({...symbols, ...parsedData}));

// 				// console.log('symbols A', symbols);
// 			};

// 			setListening(true);
// 		}
// 	}, [listening, symbols]);

// 	return (
// 		<div>
// 			{/* {console.log('symbols', symbols)} */}
// 			<ul>
// 				{Object.keys(symbols).map((symbol, index) => {
// 					// console.log(symbol);
// 					return (
// 						<li
// 							key={index}
// 						>{`${symbols[symbol].symbol}: ${symbols[symbol].closePrice}`}</li>
// 					);
// 				})}
// 			</ul>
// 		</div>
// 	);
// }

// export default App;
