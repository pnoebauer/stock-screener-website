const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const enforce = require('express-sslify');

//during testing or development
if(process.env.NODE_ENV !== 'production') require('dotenv').config(); //load .env into process environment (adds variables from there)

const app = express(); //instantiate new express application
const port = 5000//process.env.PORT || 5000; //heroku sets up process port; during development use port 5000

// app.use(compression()); //use gzip compression in the Express app to decrease size of response body
// app.use(express.json()); //for any requests coming in, process their body tag and convert to json
// app.use(express.urlencoded({ extended: true })); //url requests that contain incorrect characters (i.e. spaces) are converted to correct ones
// app.use(enforce.HTTPS({ trustProtoHeader: true })); //always use HTTPS even if request comes from HTTP

// app.use(cors()); //allow requests from port 3000 (frontend) to port 5000 (backend)


app.listen(port, error => {
	// if(error) throw error;
	console.log('Server running on port', port);
});