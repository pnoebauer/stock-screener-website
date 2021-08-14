const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const {contains} = require('cheerio/lib/static');

// URL for data
const urlSP500 = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies';
const urlDJ30 = 'https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average';
const urlNAS100 = 'https://en.wikipedia.org/wiki/Nasdaq-100';

const universes = {
	sp500: [],
	nas100: [],
	dj30: [],
};

const urls = {
	sp500: urlSP500,
	nas100: urlNAS100,
	dj30: urlDJ30,
};

try {
	const universeNames = Object.keys(universes);
	// read the list from the current txt files
	for (let i = 0; i < universeNames.length; i++) {
		const universe = universeNames[i];
		universes[universe] = JSON.parse(fs.readFileSync(`${universe}.txt`, 'utf8'));
	}
} catch (e) {
	console.log('no list stored yet');
}

// function to get the raw data
const getRawData = URL => {
	return fetch(URL).then(response => response.text());
	// .then(data => data);
};

// start of the program
const scrapeData = async (URL, processData, stockIndex) => {
	const rawData = await getRawData(URL);
	// console.log({rawData});

	// parsing the data (load will introduce <html>, <head>, and <body> elements)
	const parsedData = cheerio.load(rawData);
	// console.log(parsedData);

	const symbolList = processData(parsedData);

	if (!symbolList.length) {
		return;
	}

	fs.writeFile(`${stockIndex}.txt`, JSON.stringify(symbolList), async err => {
		if (err) {
			console.log(err);
		} else {
			console.log(`Stored ${symbolList.length} ${stockIndex} stocks`);

			universes[stockIndex] = symbolList;
		}
	});

	return symbolList;
};

const processSP500 = parsedData => {
	const tableElement = parsedData('table.wikitable#constituents')[0];
	const tbodyElement = tableElement.children[1];
	const sp500DataTable = tbodyElement.children;

	// console.log(sp500DataTable);

	const trElements = sp500DataTable.filter(row => row.name === 'tr');
	// console.log(trElements);

	const symbolList = trElements.flatMap((row, index) => {
		// console.log(index);
		const columns = row.children.filter(column => column.name === 'td');
		if (columns.length === 0) return [];

		const stockSymbolColumn = columns[0];
		// console.log(stockSymbolColumn);

		let stockSymbol = null;

		stockSymbol = stockSymbolColumn.children[0];

		stockSymbol = stockSymbol.children[0].data;
		return [stockSymbol];
	});

	return symbolList;
};

const processDJ30 = parsedData => {
	const tableElement = parsedData('table.wikitable#constituents')[0];
	// ONLY DIFFERENCE TO SP500
	// const tbodyElement = tableElement.children[1];

	const tbodyElement = tableElement.children[3];
	const dj30DataTable = tbodyElement.children;

	const trElements = dj30DataTable.filter(row => row.name === 'tr');

	const symbolList = trElements.flatMap((row, index) => {
		const columns = row.children.filter(column => column.name === 'td');
		if (columns.length === 0) return [];

		// ONLY DIFFERENCE TO SP500
		// const stockSymbolColumn = columns[0];

		// column: 0 = Exchange, 1 = Symbol {very first is Company is a th element}
		const stockSymbolColumn = columns[1];

		let stockSymbol = null;

		stockSymbol = stockSymbolColumn.children[0];

		stockSymbol = stockSymbol.children[0].data;

		// console.log(stockSymbol);
		return [stockSymbol];
	});

	return symbolList;
};

const processNAS100 = parsedData => {
	const tableElement = parsedData('table.wikitable#constituents')[0];
	const tbodyElement = tableElement.children[1];
	const nas100DataTable = tbodyElement.children;

	const trElements = nas100DataTable.filter(row => row.name === 'tr');
	// console.log(trElements);

	const symbolList = trElements.flatMap((row, index) => {
		// console.log(index);
		const columns = row.children.filter(column => column.name === 'td');
		if (columns.length === 0) return [];

		// ONLY DIFFERENCE TO SP500
		// const stockSymbolColumn = columns[0];

		const stockSymbolColumn = columns[1];
		// console.log(stockSymbolColumn);

		let stockSymbol = null;

		// ONLY DIFFERENCE TO SP500
		// stockSymbol = stockSymbolColumn.children[0]; //goes into <a> tag first

		stockSymbol = stockSymbolColumn.children[0].data;
		// console.log(stockSymbol);

		return [stockSymbol];
	});

	return symbolList;
};

const processFunctions = {
	sp500: processSP500,
	nas100: processNAS100,
	dj30: processDJ30,
};

// invoking the main function
const updateLists = async () => {
	const universeNames = Object.keys(universes);
	// read the list from the current sp500.txt file and assign to sp500List
	for (let i = 0; i < universeNames.length; i++) {
		const universe = universeNames[i];

		universes[universe] = await scrapeData(
			urls[universe],
			processFunctions[universe],
			universe
		);
	}

	return universes;
};

// updateLists().then(universes => console.log('updated', universes));
// console.log(universes);

module.exports = {
	updateLists,
	universes,
};
