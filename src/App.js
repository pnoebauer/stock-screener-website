
import React from 'react';

import './App.css';
import Header from './components/header/header.component';

import BuildScreener from './components/build-screener/build-screener.component';

import ModalExample from './components/modal/modal.example';



function App() {
  return (
    <div className="App">
      
      <Header></Header>
      <BuildScreener injectProp={'abcd'}/>

    </div>
  );
}

{/* <Header></Header>
  <ModalExample />    
<BuildScreener injectProp={'abcd'}/> */}

export default App;
