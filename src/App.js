
import React from 'react';

import './App.css';
import Header from './components/header/header.component';
// import RadarScreen from './components/radarscreen/radarscreen.component';

import BuildScreener from './components/build-screener/build-screener.component';



function App() {
  return (
    <div className="App">
      <Header></Header>
      
      <BuildScreener injectProp={'abcd'}/>

    </div>
  );
}

{/* <RadarScreen></RadarScreen> */}

export default App;
