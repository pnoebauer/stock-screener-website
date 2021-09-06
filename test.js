// const {testObj, a} = require('./webscraper');
// const {adjTestObj} = require('./constants');

// let timerId = setInterval(async () => {
// 	console.log('testObj at', new Date().getSeconds(), testObj, a);
// 	console.log('adjTestObj at', new Date().getSeconds(), adjTestObj);
// }, 3 * 1000);

const dbConnect = require('./dbConnect');
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

async function returnSymbols() {
	const symbols = await dbConnect.retrieveSymbolData();
	console.log({symbols});
	// await dbConnect.insertIntoTableSymbols(universes);
	// await dbConnect.insertIntoTableSymbols({SP500,NAS100,DJ30});
}

let timerId = setInterval(async () => {
	universes = await updateLists();
	transformUniverse(universes);
	await dbConnect.insertIntoTableSymbols(transformedUniverse);
}, 60 * 1000);

dbConnect.insertIntoTableSymbols(transformedUniverse);
returnSymbols();
