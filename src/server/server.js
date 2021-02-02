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

        let current = data.data[0]
        let tomorrow = data.data[1]
        let arrivalDayIndex = Math.abs(req.body.daysTillDep - 1);
        let returnDay = Math.abs(req.body.daysTillRet);
        console.log(arrivalDayIndex, returnDay);

        // from https://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript

        forecast(returnDay, data)

        function forecast(returnDay, data) {
        if (returnDay >= 13) {

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
            let myArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
        for (var i = 0; i < returnDay; i++) {
            console.log(myArray[i])

        let foreData = data.data[myArray[i]];
        console.log(foreData.temp)
        console.log(foreData)
        }
        }
    }




// location

        projectData.placeName = data.city_name;
        projectData.country = data.country_code;

// today
//         projectData.currentTemp = current.temp;
//         projectData.currentLowTemp = current.low_temp;
//         projectData.currentHighTemp = current.high_temp;
//         projectData.currentDescription = current.weather.description;
//         projectData.currentIcon = current.weather.icon;
// // tomorrow
//         projectData.tomorrowTemp = tomorrow.temp;
//         projectData.tomorrowLowTemp = tomorrow.low_temp;
//         projectData.tomorrowHighTemp = tomorrow.high_temp;
//         projectData.tomorrowDescription = tomorrow.weather.description;
//         projectData.tomorrowIcon = tomorrow.weather.icon;

// forecast duration trip
        
// today
        // projectData.forecast = foreData.temp
//         projectData.lowTemp0 = forecast[0].low_temp;
//         projectData.highTemp0 = forecast[0].high_temp;
//         projectData.description0 = forecast[0].weather.description;
//         projectData.icon0 = forecast[0].weather.icon;
// // tomorrow
//         projectData.temp1 = forecast[1].temp
//         projectData.lowTemp1 = forecast[1].low_temp;
//         projectData.highTemp1 = forecast[1].high_temp;
//         projectData.description1 = forecast[1].weather.description;
//         projectData.icon1 = forecast[1].weather.icon;
// // day 3
//         projectData.temp2 = forecast[2].temp
//         projectData.lowTemp2 = forecast[2].low_temp;
//         projectData.highTemp2 = forecast[2].high_temp;
//         projectData.description2 = forecast[2].weather.description;
//         projectData.icon2 = forecast[2].weather.icon;

        


// first day of trip
        // projectData.firsttemp = day1.temp;
        // projectData.firstlowTemp = day1.low_temp;
        // projectData.firsthighTemp = day1.high_temp;
        // projectData.firstdescription = day1.weather.description;
        // projectData.firsticon = day1.weather.icon;
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
