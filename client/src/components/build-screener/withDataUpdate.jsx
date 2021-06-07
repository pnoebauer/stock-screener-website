import React from 'react';

import {
	INTERVALS,
	SYMBOLS,
	API_TO_INDICATORS,
	INDICATORS_TO_API,
	CUSTOM_INDICATORS,
} from '../../assets/constants';

const permanentHeaders = ['ID', 'Symbol', 'Interval'];

function withDataUpdate(WrappedComponent) {
	class WithDataUpdate extends React.Component {
		constructor(props) {
			super(props);
			this.events = undefined;
			this.state = {
				Symbol: SYMBOLS.slice(0, 5),
				Interval: Array(5).fill(INTERVALS[0]),
				ID: [...Array(5)].map((a, idx) => idx),
			};
		}

		async componentDidMount() {
			this.startEventSource(this.state.Symbol);
		}

		async componentDidUpdate(prevProps, prevState) {
			// console.log(INDICATORS_TO_API, 'INDICATORS_TO_API');
			let arrayElementsEqual = (arr1, arr2) =>
				[...new Set(arr1)].sort().join() === [...new Set(arr2)].sort().join(); //check if both arrays contain same values (excl. duplicates)

			let sameElements = (arr1, arr2) =>
				[...arr1].sort().join() === [...arr2].sort().join(); //check if both arrays are equal (incl. duplicates)

			const currentHeaders = this.getHeaderTitle(this.state);
			const prevHeaders = this.getHeaderTitle(prevState);

			// trigger if symbols or columns change
			if (
				!sameElements(prevState.Symbol, this.state.Symbol) ||
				!arrayElementsEqual(prevHeaders, currentHeaders)
			) {
				// close old event source and start a new one with updated Symbol
				if (this.events) {
					// console.log('updating, closing eventSource', prevState.Symbol, this.state.Symbol);
					this.events.close();
					// console.log('update', this.events);
					this.startEventSource();
				}
			}
		}

		// helper function: converts the received api data object into the format of the state object
		apiObjectToStateObject(apiObject) {
			const {Symbol} = this.state;
			const header = this.getHeaderTitle(this.state);

			// console.log(apiObject, 'ao');

			// map the header (= state keys) to INDICATORS_TO_API; do not include permanent headers or customIndicators
			const customIndicators = Object.keys(CUSTOM_INDICATORS);
			const permanentOrCustomIndicators = [...permanentHeaders, ...customIndicators];

			const apiIndicators = header.flatMap(item =>
				permanentOrCustomIndicators.includes(item) ? [] : [INDICATORS_TO_API[item]]
			);

			// console.log(apiIndicators, Symbol);

			let stateIndicatorObject = {};

			try {
				//filter out the indicators that are needed in the columns
				apiIndicators.forEach(apiIndicatorName => {
					// look up the name used for the column header (and state key)
					const stateIndicatorName = API_TO_INDICATORS[apiIndicatorName];

					// console.log(apiIndicatorName, 'apiIndicatorName', stateIndicatorName);

					// converts api object to state array format
					stateIndicatorObject = {
						...stateIndicatorObject,
						[stateIndicatorName]: Symbol.map(
							symbolName =>
								// apiObject[symbolName][apiIndicatorName]
								(apiObject &&
									apiObject[symbolName] &&
									apiObject[symbolName][apiIndicatorName]) ??
								0
						),
					};
				});
			} catch (e) {
				console.log('error converted apiObject to stateObject', e);
			}

			return stateIndicatorObject;
		}

		// uses apiObjectToStateObject; starts event source to subscribe to the stock data stream from the backend; resorts the data based on the current sort config and sets the state
		startEventSource() {
			const uniqueSymbols = [...new Set(this.state.Symbol)];
			// console.log('start new event source', uniqueSymbols);

			const url = `http://localhost:4000/events/symbols?id=${uniqueSymbols.join(',')}`;

			this.events = new EventSource(url);

			// Subscribe to all events without an explicit type
			this.events.onmessage = event => {
				const symbolsDataObject = JSON.parse(event.data);

				// if (Object.keys(symbolsDataObject).length) {
				// 	const stateIndicatorObject = this.apiObjectToStateObject(symbolsDataObject);

				// 	let updatedState = {...this.state, ...stateIndicatorObject};

				// 	this.setState(updatedState);
				// }
			};
		}

		componentWillUnmount() {
			if (this.events) {
				// console.log('unmounting, closing eventSource');
				this.events.close();
			}
		}

		render() {
			console.log(this.props.stockNumber, 'sn');
			return <WrappedComponent dataObject={this.state} {...this.props} />;
		}
	}
	return WithDataUpdate;
}

export default withDataUpdate;
