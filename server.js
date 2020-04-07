// Setup empty JS object to act as endpoint for all routes
const projectData = {};
// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();
/* Dependencies */
const bodyParser = require('body-parser');
const cors = require('cors');
/* Middleware*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


// Initialize the main project folder
app.use(express.static('public'));
// Spin up the server
const port = 8000;
const server = app.listen(port, listening);
// Callback to debug
function listening(){
    console.log(`Listening on port ${port}`);
}

// Callback function to complete GET '/all'
app.get('/all', (req, resp) => {
    resp.send(projectData);
});

// Post Route to add new entry
app.post('/newEntry', (req, resp) => {
    const {date, temp, content} = req.body;
    projectData.entry = {date, temp, content };
    resp.send('Added');
});