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


// location

        projectData.placeName = data.city_name;
        projectData.country = data.country_code;

// forecast data points
        let current = data.data[0]
        let tomorrow = data.data[1]
        let arrivalDayIndex = req.body.daysTillDep;
        let returnDay = req.body.daysTillRet;

// from https://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript

        forecast(returnDay, data)

        function forecast(returnDay, data) {
        if (returnDay >= 7) {

            function currentWeather(data) {
                // today
                        projectData.currentTemp = data.data[0].temp;
                        projectData.currentLowTemp = data.data[0].low_temp;
                        projectData.currentHighTemp = data.data[0].high_temp;
                        projectData.currentDescription = data.data[0].weather.description;
                        projectData.currentIcon = data.data[0].weather.icon;
                // tomorrow
                        projectData.tomorrowTemp = tomorrow.temp;
                        projectData.tomorrowLowTemp = tomorrow.low_temp;
                        projectData.tomorrowHighTemp = tomorrow.high_temp;
                        projectData.tomorrowDescription = tomorrow.weather.description;
                        projectData.tomorrowIcon = tomorrow.weather.icon;
                    }
            return currentWeather(data)

        } else {

            projectData.arrival_0_temp = data.data[arrivalDayIndex].temp;
            projectData.arrival_0_lowTemp = data.data[arrivalDayIndex].low_temp;
            projectData.arrival_0_highTemp = data.data[arrivalDayIndex].high_temp;
            projectData.arrival_0_description = data.data[arrivalDayIndex].weather.description;
            projectData.arrival_0_icon = data.data[arrivalDayIndex].weather.icon;

                async function weatherTrip(arrivalDayIndex, returnDay) {
                    let arrival0 = data.data[arrivalDayIndex]
                    let arrival1 = Math.abs(arrivalDayIndex + 1);
                    let arrival2 = Math.abs(arrivalDayIndex + 2);
                    let arrival3 = Math.abs(arrivalDayIndex + 3);
                    let arrival4 = Math.abs(arrivalDayIndex + 4);
                    let arrival5 = Math.abs(arrivalDayIndex + 5);
                    let arrival6 = Math.abs(arrivalDayIndex + 6);

                    let day1 = (arrival1, returnDay) => {
                        if (arrival1 <= returnDay){

                        return projectData.arrival_1_temp = data.data[arrival1].temp,
                        projectData.arrival_1_lowTemp = data.data[arrival1].low_temp,
                        projectData.arrival_1_highTemp = data.data[arrival1].high_temp,
                        projectData.arrival_1_description = data.data[arrival1].weather.description,
                        projectData.arrival_1_icon = data.data[arrival1].weather.icon;
                        }
                    };
                    day1(arrival1,returnDay)

                    let day2 = (arrival2, returnDay) => {
                        if (arrival2 <= returnDay) {

                        return projectData.arrival_2_temp = data.data[arrival2].temp,
                        projectData.arrival_2_lowTemp = data.data[arrival2].low_temp,
                        projectData.arrival_2_highTemp = data.data[arrival2].high_temp,
                        projectData.arrival_2_description = data.data[arrival2].weather.description,
                        projectData.arrival_2_icon = data.data[arrival2].weather.icon;
                        }
                    };
                    day2(arrival2,returnDay)

                    let day3 = (arrival3, returnDay) => {
                    if (arrival3 <= returnDay) {

                        return projectData.arrival_3_temp = data.data[arrival3].temp,
                        projectData.arrival_3_lowTemp = data.data[arrival3].low_temp,
                        projectData.arrival_3_highTemp = data.data[arrival3].high_temp,
                        projectData.arrival_3_description = data.data[arrival3].weather.description,
                        projectData.arrival_3_icon = data.data[arrival3].weather.icon;
                        }
                    };
                    day3(arrival3,returnDay)
                }
    weatherTrip(arrivalDayIndex, returnDay)
    }
}

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
