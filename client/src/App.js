import React from 'react';

import './App.css';
import Header from './components/header/header.component';

import Radarscreen from './components/radarscreen/radarscreen.component';

function App() {
	return (
		<div className='App'>
			<Header />
			<Radarscreen />
		</div>
	);
}

export default App;
