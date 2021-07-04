import React from 'react';

import Header from './components/header/header.component';

import Radarscreen from './components/radarscreen/radarscreen.component';

import Statistics from './components/statistics/statistics.component';

import ChartDataLoader from './components/chart/chartDataLoader.component';

import './App.css';

function App() {
	return (
		<div className='App'>
			<Header />
			{/* <Statistics />
			<Radarscreen /> */}
			<ChartDataLoader />
		</div>

		// <ChartDataLoader />
	);
}

export default App;
