const fetch = require('node-fetch');

if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //load .env into process environment (adds variables from there)

const urlEndPoint = 'https://api.tdameritrade.com/v1/marketdata';

const addDays = (date, days) => {
	const copy = new Date(Number(date));
	copy.setDate(date.getDate() + days);
	return copy;
};

const convertDateToUnix = (...dateArgs) => {
	// new Date(year, month, day, hours, minutes, seconds, milliseconds)
	// Note: months range from 0 to 11
	// const newLocal = new Date(...dateArgs).getTime() - new Date().getTimezoneOffset() * 60 * 1000;
	return new Date(...dateArgs).getTime();
};

const fetchData = async (url, queryParams) => {
	const apikey = process.env.API_SECRET_KEY;

	const params = {
		apikey,
		...queryParams,
	};

	const queryExt = new URLSearchParams(params).toString();
	const queryString = `${url}?${queryExt}`;
	// console.log({apikey}, {queryString});
	try {
		const response = await fetch(queryString);
		const data = await response.json();
		// console.log(data);
		return data;
	} catch (e) {
		console.log('error fetch data', e);
	}
};

const fetchLiveData = async symbol => {
	const urlRealTime = `${urlEndPoint}/quotes`;
	const queryParams = {symbol};
	return fetchData(urlRealTime, queryParams);
};

// fetchLiveData(['SPY', 'GOOGL']);

const fetchHistoricalData = async (
	symbol,
	period,
	periodType,
	frequency,
	frequencyType
) => {
	/* 
	----------------------
		Prices can either be fetched based on period 
		(do not enter a start date) 
		or based on start and end date
	----------------------
	*/

	// fetchData(urlRealTime, symbol);
	// /v1/marketdata/GOOGL/pricehistory?apikey=APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD&periodType=day&frequencyType=minute&frequency=1&endDate=1617271200000&startDate=1609495200000&needExtendedHoursData=true
	// const startDate = new Date(1990, 0, 1, 0, 0);
	const startDate = new Date(2000, 0, 1, 0, 0);
	// const startDateUnix = startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000; //UTC time
	const startDateUnix = startDate.getTime(); //getTime already returns in UTC

	// const endDate = addDays(startDate, 10);
	// const endDate = new Date(2021, 5, 11, 0, 0); //default: prior trading day
	const endDate = new Date(); //default: prior trading day
	// const endDateUnix = endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000;
	const endDateUnix = endDate.getTime(); //getTime already returns in UTC

	// console.log(startDateUnix, endDateUnix);

	/* 	// Valid periods by periodType:
	// day: 1, 2, 3, 4, 5, 10*
	// month: 1*, 2, 3, 6
	// year: 1*, 2, 3, 5, 10, 15, 20
	// ytd: 1*
	const period = 5; //not required if start date is used
	// Valid values are day, month, year, or ytd (year to date). Default is day.
	const periodType = 'year';

	// 	Valid frequencyTypes by periodType (defaults marked with an asterisk):
	// day: minute*
	// month: daily, weekly*
	// year: daily, weekly, monthly*
	// ytd: daily, weekly*
	const frequencyType = 'daily';
	// Valid frequencies by frequencyType:
	// minute: 1*, 5, 10, 15, 30
	// daily: 1*
	// weekly: 1*
	// monthly: 1*
	const frequency = 1; */
	// const needExtendedHoursData = true;

	const urlHistorical = `${urlEndPoint}/${symbol}/pricehistory`;
	const queryParams = {
		periodType,
		period,
		frequencyType,
		frequency,
		// endDate: endDateUnix,
		// startDate: startDateUnix,
		// needExtendedHoursData,
	};

	try {
		const data = await fetchData(urlHistorical, queryParams);

		return data;
	} catch (e) {
		console.log('error fetching historical data', e);
	}
};

module.exports = {
	fetchLiveData,
	fetchHistoricalData,
};
