const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const {contains} = require('cheerio/lib/static');

let nas100List;

try {
	// read the list from the current nas100.txt file and assign to nas100List
	nas100List = JSON.parse(fs.readFileSync('nas100.txt', 'utf8'));
} catch (e) {
	console.log('no list stored yet');

	// updatenas100List().then(updatedList => {
	// 	nas100List = updatedList;
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
			console.log(`Stored ${symbolList.length} NAS100 stocks`);

			nas100List = symbolList;
		}
	});

	return symbolList;
};

const processNAS100 = parsedData => {
	const tableElement = parsedData('table.wikitable#constituents')[0];

	const tbodyElement = tableElement.children[1];

	const nas100DataTable = tbodyElement.children;

	// console.log(nas100DataTable);

	// console.log(nas100DataTable);

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

// URL for data
const URL = 'https://en.wikipedia.org/wiki/Nasdaq-100';
// const URL = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies';

// scrapeData(URL, processNAS100, 'nas100');

// invoking the main function
const updateNAS100List = async () => {
	nas100List = await scrapeData(URL, processNAS100, 'nas100');
	// console.log({nas100List});
	return nas100List;
};

// console.log(nas100List);

module.exports = {
	updateNAS100List,
	nas100List,
};
