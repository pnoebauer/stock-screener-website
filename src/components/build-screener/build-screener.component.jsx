// import React from 'react';

import Test from './test';

import withFetch from './withFetch';
import withSorting from './withSorting';
import RadarScreen from '../radarscreen/radarscreen.component';

const urlRealTime = 'https://api.tdameritrade.com/v1/marketdata/quotes';
const apikey = 'APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD';




// const BuildScreener = withFetch(
// 	RadarScreen,
// 	urlRealTime,
//  	apikey
// );

const BuildScreener = withSorting(
	Test
);


export default BuildScreener;