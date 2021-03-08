
import React from 'react';

import './App.css';
import Header from './components/header/header.component';
// import RadarScreen from './components/radarscreen/radarscreen.component';

import withFetch from './components/radarscreen/withFetch';
import Test from './components/radarscreen/test'



const TestFetch = withFetch(
  Test,
  'test'
)


function App() {
  return (
    <div className="App">
      <Header></Header>
      
      <TestFetch injectProp={'abcd'}/>

    </div>
  );
}

{/* <RadarScreen></RadarScreen> */}

export default App;
