const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const enforce = require('express-sslify');

const fetchData = require('./fetchData');

//during testing or development
if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //load .env into process environment (adds variables from there)

const apiKey = process.env.API_SECRET_KEY;

fetchData.fetchLiveData('SPY');

const app = express(); //instantiate new express application
const port = process.env.PORT || 4000; //heroku sets up process port; during development use port 5000

// app.use(compression()); //use gzip compression in the Express app to decrease size of response body
// app.use(express.json()); //for any requests coming in, process their body tag and convert to json
// app.use(express.urlencoded({ extended: true })); //url requests that contain incorrect characters (i.e. spaces) are converted to correct ones
// app.use(enforce.HTTPS({ trustProtoHeader: true })); //always use HTTPS even if request comes from HTTP

// app.use(cors()); //allow requests from port 3000 (frontend) to port 5000 (backend)

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}

// app.get('/', (req, res) => {
// 	res.send('Hello World!');
// });

app.listen(port, error => {
	if (error) throw error;
	console.log('Server running on port', port);
});
