const fetch = require('node-fetch');

const urlRealTime = 'https://api.tdameritrade.com/v1/marketdata/quotes';

const fetchData = (url, symbol) => {
	const apiKey = process.env.API_SECRET_KEY;

	const params = {
		apikey: apiKey,
		symbol: symbol,
	};

	const queryExt = new URLSearchParams(params).toString();

	const queryString = url.concat('?', queryExt);

	fetch(queryString)
		.then(res => res.json())
		.then(data => console.log(data));
};

const fetchLiveData = symbol => {
	fetchData(urlRealTime, symbol);
};

function addDays(date, days) {
	const copy = new Date(Number(date));
	copy.setDate(date.getDate() + days);
	return copy;
}

const fetchHistoricalData = symbol => {
	// fetchData(urlRealTime, symbol);
	// /v1/marketdata/GOOGL/pricehistory?apikey=APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD&periodType=day&frequencyType=minute&frequency=1&endDate=1617271200000&startDate=1609495200000&needExtendedHoursData=true
	const startDate = new Date(2020, 0, 1);
	const startDateUnix = startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000;

	const endDate = addDays(startDate, 60);
	const endDateUnix = endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000;
};

const convertDateToUnix = (...dateArgs) => {
	// new Date(year, month, day, hours, minutes, seconds, milliseconds)
	// Note: months range from 0 to 11
	new Date(...dateArgs).getTime() - new Date().getTimezoneOffset() * 60 * 1000;

	//add days
	// const date = new Date();
	// date.setDate(date.getDate() + 10);
};

module.exports = {
	fetchLiveData,
};
