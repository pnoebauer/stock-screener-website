
import './App.css';
import Header from './components/header.component';
import RadarScreen from './components/radarscreen.component';

import Select from './components/select.component'

function App() {
  return (
    <div className="App">
      <Header></Header>
      <RadarScreen></RadarScreen>
      <Select options={['Daily', 'Hourly', '5 Min']}></Select>
    </div>
  );
}

export default App;
