// import React from 'react';

import withFetch from './withFetch';
import RadarScreen from '../radarscreen/radarscreen.component';

const urlRealTime = 'https://api.tdameritrade.com/v1/marketdata/quotes';
const apikey = 'APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD';


const BuildScreener = withFetch(
	RadarScreen,
	urlRealTime,
 	apikey
);


export default BuildScreener;