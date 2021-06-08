// import React from 'react';

// import Test from './test';
// import TestFetch from './testFetch.component';

// import withFetch from './withFetch';

// import withDataUpdate from './withDataUpdate';
// import withSorting from './withSorting';

import RadarScreen from '../../radarscreen/radarscreen.component';

// const urlRealTime = 'https://api.tdameritrade.com/v1/marketdata/quotes';
// const apikey = 'APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD';

// const BuildScreener = withSorting(Test);

// const BuildScreener = withFetch(TestFetch, urlRealTime, apikey);

// const BuildScreener = withSorting(withFetch(RadarScreen, urlRealTime, apikey));
// const BuildScreener = withSorting(RadarScreen);

// const BuildScreener = withSorting(withDataUpdate(RadarScreen));

// const BuildScreener = withDataUpdate(RadarScreen);

const BuildScreener = RadarScreen;

export default BuildScreener;
