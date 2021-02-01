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

        let days = req.body.daysTillDep;
        let day01 = Math.abs(days + 1);
        let returnDay = Math.abs(days + req.body.duration);

        forecast(days)

        function forecast(days) {
        if (days >= 16) {
            return 16
        } else return days
        };
        let fore = data.data[days]
        let day1 = data.data[day01]
        let travel = data.data[returnDay]

        let current = data.data[0]
        let tomorrow = data.data[1]

// location
        projectData.placeName = data.city_name;
        projectData.country = data.country_code;
// today
        projectData.currentTemp = current.temp;
        projectData.currentLowTemp = current.low_temp;
        projectData.currentHighTemp = current.high_temp;
        projectData.currentDescription = current.weather.description;
        projectData.currentIcon = current.weather.icon;
// tomorrow
        projectData.tomorrowTemp = tomorrow.temp;
        projectData.tomorrowLowTemp = tomorrow.low_temp;
        projectData.tomorrowHighTemp = tomorrow.high_temp;
        projectData.tomorrowDescription = tomorrow.weather.description;
        projectData.tomorrowIcon = tomorrow.weather.icon;
// day of arrival
        projectData.temp = fore.temp;
        projectData.lowTemp = fore.low_temp;
        projectData.highTemp = fore.high_temp;
        projectData.description = fore.weather.description;
        projectData.icon = fore.weather.icon;
// first day of trip
        projectData.firsttemp = day1.temp;
        projectData.firstlowTemp = day1.low_temp;
        projectData.firsthighTemp = day1.high_temp;
        projectData.firstdescription = day1.weather.description;
        projectData.firsticon = day1.weather.icon;
// Departure

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
