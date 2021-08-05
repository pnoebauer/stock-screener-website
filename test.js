const {updateSP500List, sp500List} = require('./webscraper');

const updateList = async () => {
	const updatedList = await updateSP500List();

	// console.log(updatedList, sp500List);
};

// console.log({sp500List});
updateList();
