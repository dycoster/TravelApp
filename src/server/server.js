projectData = {};

// API'S
const dotenv = require('dotenv');
dotenv.config();
const wbUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat='
const wbk = process.env.weatherBitKey
const geok = process.env.geoUsername

const pbUrl = 'https://pixabay.com/api/?key='
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

// Add POST Route that adds incoming data to projectData
app.post('/add', addData);

function addData (req, res) {
    projectData.location = req.body.location
    projectData.departure = req.body.depart;
    projectData.return = req.body.return;
    res.send(projectData);
    console.log(projectData);
}

app.get('/geonames', async(req,res) => {
    let geoUrl = `$http://api.geonames.org/searchJSON?q=${projectData.location}&maxRows=1&username=${process.env.geoUsername}`;
    fetch (geoUrl)
    .then(res => res.json())
    .then(data =>{
        console.log(data)})
})

// app.get('/add', async (req, res)=> {
//     const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${req.body.lat}&lon=${req.body.long}&key=${wbk}`)

//     try {
//         const apiData = await response.json()
//         console.log(apiData)
//         res.send(apiData);
//     } catch (error) {
//         console.log('error', error)
//     }
// })
// Add a GET route that returns the projectData object
// app.get('/all', function (req, res) {
//     res.send(projectData);
//   }),
