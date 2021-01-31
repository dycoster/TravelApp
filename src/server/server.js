projectData = {};

// API'S
const dotenv = require('dotenv');
dotenv.config();
const wbUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat='
const wbk = process.env.weatherBitKey

const pbk = process.env.pixabayKey
const pbUrl = `https://pixabay.com/api/?key=${pbk}`



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

// WeatherBit API request with geonamesCoords
app.post('/add', getWeather);

async function getWeather (req, res) {

    // console.log(req.body)

    let weatherUrl = `${wbUrl}${req.body.lat}&lon=${req.body.long}&key=${wbk}`

    const response = await fetch(weatherUrl)

    try {
        const data = await response.json()

        let days = req.body.daysTillDep

        forecast(days)

        function forecast(days) {
        if (days >= 16) {
            return 16
        } else return days
        };
        let fore = data.data[days]
        let current = data.data[0]

        projectData.placeName = data.city_name;
        projectData.country = data.country_code;
        projectData.temp = fore.temp;
        projectData.description = fore.weather.description;
        projectData.icon = fore.weather.icon;
        projectData.currentTemp = current.temp;
        projectData.currentDescription = current.weather.description;
        projectData.currentIcon = current.weather.icon;
        res.send(projectData);
        console.log(projectData);

    } catch (error) {
        console.log('error', error)
    }
}

// Add a GET route that returns the projectData object
app.get('/all', function (req, res) {
    res.send(projectData);
  })
