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

export default App;
