const dbConnect = require('./dbConnect');
let {SYMBOLS, UNIVERSES} = require('./constants');
let {updateLists, universes} = require('./webscraper');

let transformedUniverse = {
	SP500: universes.sp500,
	NAS100: universes.nas100,
	DJ30: universes.dj30,
};

const transformUniverse = universes => {
	transformedUniverse.SP500 = universes.sp500;
	transformedUniverse.NAS100 = universes.nas100;
	transformedUniverse.DJ30 = universes.dj30;
};

async function updateUNIVERSESfromDB() {
	const symbols = await dbConnect.retrieveSymbolData();
	// const symbols = [
	// 	{ticker: 'a', DJ30: false, NAS100: false, SP500: true},
	// 	{ticker: 'b', DJ30: false, NAS100: false, SP500: true},
	// ];
	// console.log({symbols}, symbols.length);

	SYMBOLS.splice(symbols.length);

	for (let i = 0; i < symbols.length; i++) {
		const stock = symbols[i];
		SYMBOLS[i] = stock.ticker;
	}

	// console.log(SYMBOLS, 'map');
	UNIVERSES.SP500 = symbols.filter(stock => stock.SP500).map(stock => stock.ticker);
	UNIVERSES.NAS100 = symbols.filter(stock => stock.NAS100).map(stock => stock.ticker);
	UNIVERSES.DJ30 = symbols.filter(stock => stock.DJ30).map(stock => stock.ticker);
}

async function updateAndInsertUNIVERSES() {
	// run the webscraper to update all stock universes
	universes = await updateLists();
	// db requires uppercase keys - transform universes object to required format
	transformUniverse(universes);
	// insert the updated stock universe list into the table
	await dbConnect.insertIntoTableSymbols(transformedUniverse);
}

let timerId = setInterval(async () => {
	await updateAndInsertUNIVERSES();
}, 60 * 1000);

dbConnect.insertIntoTableSymbols(transformedUniverse);
// updateUNIVERSESfromDB();

module.exports = {
	updateUNIVERSESfromDB,
};
