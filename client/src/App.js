import React from 'react';

import Header from './components/header/header.component';

import Radarscreen from './components/radarscreen/radarscreen.component';

import Home from './components/portal-modal/home';

import './App.css';

function App() {
	return (
		<div className='App'>
			{/* <Header />
			<Radarscreen /> */}
			<Home />
		</div>
	);
}

export default App;
