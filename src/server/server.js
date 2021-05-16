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

    let weatherUrl = `${wbUrl}${req.body.lat}&lon=${req.body.long}&key=${wbk}`

    const response = await fetch(weatherUrl)

    try {
        const data = await response.json()

// today
        // projectData.todayTemp = data.data[0].temp
        // projectData.todayDescription = data.data[0].weather.description
        // projectData.todayIcon = data.data[0].weather.icon
        // projectData.todayDate = data.data[0].valid_date.split("-").reverse().join("-")

// location
        projectData.placeName = data.city_name;
        projectData.country = data.country_code;

// forecast data points
        let arrivalDayIndex = req.body.daysTillDep;
        let returnDayIndex = arrivalDayIndex + 7;


// an array to store this data:
        const WeatherDataArray = data.data
        const tripWeatherArray = []

        if (arrivalDayIndex<7) {
            for(let i = arrivalDayIndex; i <= returnDayIndex; i++ ){
                tripWeatherArray.push(WeatherDataArray[i])
                    projectData.temps = tripWeatherArray.map(dayData => dayData.temp)
                    projectData.descriptions = tripWeatherArray.map(dayData => dayData.weather.description)
                    projectData.icons = tripWeatherArray.map(dayData => dayData.weather.icon)
                    projectData.dates = tripWeatherArray.map(dayData => dayData.valid_date.split("-").reverse().join("-"))
            }
        } else {
                projectData.todayTemp = data.data[0].temp
                projectData.todayDescription = data.data[0].weather.description
                projectData.todayIcon = data.data[0].weather.icon
                projectData.todayDate = data.data[0].valid_date.split("-").reverse().join("-")
            };

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


