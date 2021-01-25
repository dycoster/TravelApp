projectData = {};

// API
const dotenv = require('dotenv');
dotenv.config();
const wbk = process.env.weatherBitKey
const geok = process.env.geoUsername
const pbk = process.env.pixabayKey

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
const { response } = require('express');
app.use(cors());

// to allow making fetch requests in server
const fetch = require('node-fetch')

// Initialize the main project folder
app.use(express.static('dist'))

// Setup Server
const port = 3030;

const server = app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
}

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.post('/add', async (req, res)=> {
    console.log(req.body.long, req.body.lat)
    const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${req.body.lat}&lon=${req.body.long}&key=${wbk}`)

    try {
        const apiData = await response.json()
        console.log(apiData)
        res.send(apiData);
    } catch (error) {
        console.log('error', error)
    }
})
// Add a GET route that returns the projectData object
// app.get('/all', function (req, res) {
//     res.send(projectData);
//   })

// // Add POST Route that adds incoming data to projectData
// app.post('/add', addData);

// function addData (req, res) {
//     projectData.name = req.body.name
//     projectData.temperature = req.body.temperature;
//     projectData.date = req.body.date;
//     projectData.user_response = req.body.user_response;
//     projectData.icon = req.body.icon;
//     res.send(projectData);
//     console.log(projectData);
// }

