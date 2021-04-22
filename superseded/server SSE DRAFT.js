const express = require('express');

const cors = require('cors');

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
