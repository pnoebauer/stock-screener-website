import React from 'react';

import {Switch, Route} from 'react-router-dom';

import Header from './components/header/header.component';

// import Radarscreen from './components/radarscreen/radarscreen.component';
// import Statistics from './components/statistics/statistics.component';
// import ChartDataLoader from './components/chart/chartDataLoader.component';

import RadarscreenPage from './pages/radarscreen/radarscreen.component';
import ChartPage from './pages/chart/chart.component';

import './App.css';

function App() {
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

export default App;
