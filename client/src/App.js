import React from 'react';

import './App.css';
import Header from './components/header/header.component';

import BuildScreener from './components/build-screener/build-screener.component';

function App() {
	return (
		<div className='App'>
			<Header />
			<BuildScreener injectProp={'abcd'} />
		</div>
	);
}

// class App extends React.Component {
// 	callAPI() {
// 		fetch('http://localhost:4000')
// 			.then(res => res.json())
// 			// .then(res => console.log(res, 'res'))
// 			.then(data => console.log(data, 'data'))
// 			.catch(e => console.log(e, 'error'));

// 		// fetch(
// 		// 	'https://api.tdameritrade.com/v1/marketdata/GOOGL/pricehistory?apikey=APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD&periodType=day&frequencyType=minute&frequency=1&endDate=1617271200000&startDate=1609495200000&needExtendedHoursData=true'
// 		// )//.then(res => console.log(res, 'res'));
// 		// 	.then(res => res.json())
// 		// 	.then(data => console.log(data));
// 	}

// 	componentDidMount() {
// 		console.log('mounted');
// 		this.callAPI();
// 	}
// 	render() {
// 		return <div className='App'>Test</div>;
// 	}
// }

export default App;
