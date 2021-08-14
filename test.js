const {updateLists, universes} = require('./webscraper');

const updateList = async () => {
	const updatedList = await updateLists();

	console.log(updatedList, universes);
};

console.log({universes});
updateList();
