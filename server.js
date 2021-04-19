const express = require('express');

const cors = require('cors');

const util = require('util');

const fetch = require('node-fetch');

const fetchData = require('./fetchData');

//during testing or development
if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //load .env into process environment (adds variables from there)

const app = express(); //instantiate new express application
const PORT = 4000;

app.use(express.json()); //for any requests coming in, process their body tag and convert to json
app.use(express.urlencoded({extended: true})); //url requests that contain incorrect characters (i.e. spaces) are converted to correct ones
app.use(cors()); //allow requests from port 3000 (frontend) to port 5000 (backend)

let clients = [];
let facts = [];

app.listen(PORT, error => {
	if (error) throw error;
	console.log('Server running on port', PORT);
});

// repeat with the interval of 2 seconds
// let timerId = setInterval(() => console.log('tick'), 2000);
// let timerId = setInterval(
// 	// () => fetchData.fetchLiveData('SPY').then(data => console.log(data.SPY.lastPrice)),
// 	() => fetchData.fetchLiveData('SPY').then(data => console.log(data)),
// 	10000
// );

let cachedData;

const symbols = ['SPY', 'GOOGL'];

let timerId = setInterval(
	// () => fetchData.fetchLiveData('SPY').then(data => console.log(data.SPY.lastPrice)),
	async () => {
		const data = await fetchData.fetchLiveData(symbols);

		// console.log('-----', data, '--------BEFORE');

		symbols.forEach(symbol => {
			const {
				quoteTimeInLong,
				tradeTimeInLong,
				regularMarketTradeTimeInLong,
				...filteredData
			} = data[symbol];

			// console.log(filteredData);
			data[symbol] = filteredData;

			// cachedData[symbol]=filteredData;
		});

		console.log(util.isDeepStrictEqual(data, cachedData));

		cachedData = data;
		// console.log(data, '--------AFTER');
	},
	10000
);

// // after 5 seconds stop
// setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);

// util.isDeepStrictEqual(obj1, obj2) // true

// fetch(
// 	'https://api.tdameritrade.com/v1/marketdata/GOOGL/pricehistory?apikey=APRKWXOAWALLEUMXPY1FCGHQZ5HDJGKD&periodType=day&frequencyType=minute&frequency=1&endDate=1617271200000&startDate=1609495200000&needExtendedHoursData=true'
// )
// 	.then(res => res.json())
// 	.then(data => console.log(data));

function eventsHandler(req, res) {
	const headers = {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
	};
	res.writeHead(200, headers); //HTTP status set to 200 and headers object written to head

	//facts array is turned into a string
	const data = `data: ${JSON.stringify(facts)}\n\n`; // \n\n is mandatory to indicate the end of an event

	res.write(data);

	const clientId = Date.now();

	// create new client based on clientID and response
	const newClient = {
		id: clientId,
		res,
	};

	// console.log(newClient, 'newClient');

	// add this client to clients array
	clients.push(newClient);

	// when the client closes the connection that client will be filtered out from the clients array
	req.on('close', () => {
		console.log(`${clientId} Connection closed`);
		clients = clients.filter(client => client.id !== clientId);
	});
}

app.get('/events', eventsHandler);

// const eventType = 'test';

// sendEventsToAll iterates the clients array and uses the write method of each Express object to send the update.
function sendEventsToAll(newFact) {
	clients.forEach(client =>
		client.res.write(
			`event: data: ${JSON.stringify(newFact)}\n\n`
			// specify event type so that frontend can only listen to this type of event
			// // `event: ${eventType}\ndata: ${JSON.stringify(newFact)}\n\n`
		)
	);
}

// The addFact middleware saves the fact, returns it to the client which made POST request, and invokes the sendEventsToAll function.
async function addFact(req, res) {
	const newFact = req.body;
	facts.push(newFact);
	res.json(newFact);
	console.log('----------', facts, 'facts', newFact, 'newFact----------');
	return sendEventsToAll(newFact);
}

app.post('/fact', addFact);
