import React from 'react';

import {Switch, Route} from 'react-router-dom';

import Header from './components/header/header.component';

// import Radarscreen from './components/radarscreen/radarscreen.component';
// import Statistics from './components/statistics/statistics.component';
// import ChartDataLoader from './components/chart/chartDataLoader.component';

import RadarscreenPage from './pages/radarscreen/radarscreen.component';
import ChartPage from './pages/chart/chart.component';

import {UNIVERSES, SYMBOLS} from './assets/constants';

import './App.css';

class App extends React.Component {
	async componentDidMount() {
		const response = await fetch('http://localhost:4000/universes', {});

		let universe = await response.json();

		console.log(universe);

		SYMBOLS.splice(0);

		const allStocks = [
			...new Set([...universe.SP500, ...universe.NAS100, ...universe.DJ30]),
		];

		for (let i = 0; i < allStocks.length; i++) {
			SYMBOLS[i] = allStocks[i];
		}

		// console.log(SYMBOLS, 'map');
		UNIVERSES.SP500 = universe.SP500;
		UNIVERSES.NAS100 = universe.NAS100;
		UNIVERSES.DJ30 = universe.DJ30;
	}

	render() {
		return (
			<div className='App'>
				<Header />

				{/* <Statistics />
			<Radarscreen /> */}
				{/* <ChartDataLoader /> */}
				{/* <RadarscreenPage /> */}
				{/* <ChartPage /> */}

				<Switch>
					<Route exact path='/' component={ChartPage} />
					<Route exact path='/screen' component={RadarscreenPage} />
					<Route exact path='/chart' component={ChartPage} />
				</Switch>
			</div>

			// <ChartDataLoader />
		);
	}
}

export default App;
