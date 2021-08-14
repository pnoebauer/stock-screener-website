const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const {contains} = require('cheerio/lib/static');

let dj30List;

try {
	// read the list from the current dj30.txt file and assign to dj30List
	dj30List = JSON.parse(fs.readFileSync('dj30.txt', 'utf8'));
} catch (e) {
	console.log('no list stored yet');

	// updatedj30List().then(updatedList => {
	// 	dj30List = updatedList;
	// });
}

// function to get the raw data
const getRawData = URL => {
	return fetch(URL)
		.then(response => response.text())
		.then(data => {
			// console.log({data});
			return data;
		});
};

// start of the program
const scrapeData = async (URL, processData, fileName) => {
	const rawData = await getRawData(URL);

	// console.log({rawData});
	// parsing the data (load will introduce <html>, <head>, and <body> elements)
	const parsedData = cheerio.load(rawData);
	// console.log(parsedData);

	const symbolList = processData(parsedData);

	if (!symbolList.length) {
		return;
	}

	fs.writeFile(`${fileName}.txt`, JSON.stringify(symbolList), async err => {
		if (err) {
			console.log(err);
		} else {
			console.log(`Stored ${symbolList.length} DJ30 stocks`);

			dj30List = symbolList;
		}
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

// URL for data
// const URL = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies';
const URL = 'https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average';

// scrapeData(URL, processDJ30, 'dj30');

// invoking the main function
const updatedj30List = async () => {
	dj30List = await scrapeData(URL, processDJ30, 'dj30');
	// console.log({dj30List});
	return dj30List;
};

updatedj30List();

// console.log(dj30List);

module.exports = {
	updatedj30List,
	dj30List,
};
