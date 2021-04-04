const fetch = require('node-fetch');

const fetchData = (url, apiKey) => {
	const params = {
		apikey: apiKey,
		symbol: 'SPY',
	};

	const queryExt = new URLSearchParams(params).toString();
	const queryString = url.concat('?', queryExt);

	fetch(queryString)
		.then(res => res.json())
		.then(text => console.log(text));
};

module.exports = {
	fetchData,
};
