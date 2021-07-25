const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

let sp500List;

try {
	sp500List = JSON.parse(fs.readFileSync('sp500.txt', 'utf8'));
} catch (e) {
	console.log('no list stored yet');
}

const readList = listName => {
	return new Promise(resolve => {
		fs.readFile(`${listName}.txt`, 'utf8', function (err, data) {
			// Display the file content
			// console.log(JSON.parse(data));
			return resolve(JSON.parse(data));
		});
	});
};
// fs.readFile('sp500.txt', 'utf8', function (err, data) {
// 	// Display the file content
// 	// console.log(JSON.parse(data));
// 	sp500List = JSON.parse(data);
// });

const getList = listName => {
	// readList(listName).then(data => console.log(data));
	return readList(listName).then(data => data);
};

// getList('sp500');

// getList('sp500').then(list => (sp500List = list));

console.log(sp500List, 'listA');

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
			console.log(`Stored ${symbolList.length} S&P500 stocks`);
			// readList();
			sp500List = await getList('sp500');
			console.log(sp500List);
		}
	});
};

const processSP500 = parsedData => {
	const tableElement = parsedData('table.wikitable')[0];
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

// URL for data
// const URL = 'https://en.wikipedia.org/wiki/Cricket_World_Cup';
const URL = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies';

// invoking the main function
const updateSP500List = () => scrapeData(URL, processSP500, 'sp500');

// fs.readFile('sp500.txt', 'utf8', function (err, data) {
// 	// Display the file content
// 	console.log(JSON.parse(data));
// });

updateSP500List();

// console.log(sp500List);

module.exports = {
	updateSP500List,
	sp500List,
};

// const fetch = require('node-fetch');
// const cheerio = require('cheerio');

// // function to get the raw data
// const getRawData = URL => {
// 	return fetch(URL)
// 		.then(response => response.text())
// 		.then(data => {
// 			return data;
// 		});
// };

// // URL for data
// const URL = 'https://en.wikipedia.org/wiki/Cricket_World_Cup';

// // start of the program
// const getCricketWorldCupsList = async () => {
// 	const cricketWorldCupRawData = await getRawData(URL);

// 	// parsing the data
// 	const parsedCricketWorldCupData = cheerio.load(cricketWorldCupRawData);

// 	// extracting the table data
// 	const worldCupsDataTable =
// 		parsedCricketWorldCupData('table.wikitable')[0].children[1].children;

// 	console.log(parsedCricketWorldCupData('table.wikitable')[0]);
// 	// for (let i = 0; i < parsedCricketWorldCupData('table.wikitable').length; i++) {
// 	// 	console.log(parsedCricketWorldCupData('table.wikitable')[i], i);
// 	// }

// 	// console.log({worldCupsDataTable, l: worldCupsDataTable.length});
// 	console.log('Year --- Winner --- Runner');
// 	worldCupsDataTable.forEach(row => {
// 		// console.log(row.name);
// 		// extracting `td` tags
// 		if (row.name === 'tr') {
// 			let year = null,
// 				winner = null,
// 				runner = null;

// 			const columns = row.children.filter(column => column.name === 'td');

// 			// extracting year
// 			const yearColumn = columns[0];
// 			if (yearColumn) {
// 				year = yearColumn.children[0];
// 				if (year) {
// 					year = year.children[0].data;
// 				}
// 			}

// 			// extracting winner
// 			const winnerColumn = columns[3];
// 			if (winnerColumn) {
// 				winner = winnerColumn.children[1];
// 				if (winner) {
// 					winner = winner.children[0].data;
// 				}
// 			}

// 			// extracting runner
// 			const runnerColumn = columns[5];
// 			if (runnerColumn) {
// 				runner = runnerColumn.children[1];
// 				if (runner) {
// 					runner = runner.children[0].data;
// 				}
// 			}

// 			if (year && winner && runner) {
// 				// console.log(`${year} --- ${winner} --- ${runner}`);
// 			}
// 		}
// 	});
// };

// // invoking the main function
// getCricketWorldCupsList();
