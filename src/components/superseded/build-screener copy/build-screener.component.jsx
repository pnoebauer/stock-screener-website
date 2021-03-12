import React from 'react';

import withFetch from './withFetch';
import Test from './test';


const urlRealTime = 'https://api.tdameritrade.com/v1/marketdata/quotes';
const apikey = 'APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD';


const BuildScreener = withFetch(
	Test,
	urlRealTime,
 	apikey
);


export default BuildScreener;