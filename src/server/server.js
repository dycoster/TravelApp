let projectData = {};

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

module.exports = app

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

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// Setup Server
const port = 3030;

const server = app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
}

// WeatherBit API request with geonamesCoords
app.post('/add', getWeather);

async function getWeather (req, res) {

    let weatherUrl = `${wbUrl}${req.body.lat}&lon=${req.body.long}&key=${wbk}`

    const response = await fetch(weatherUrl)

    try {
        const data = await response.json()

// location
        projectData.placeName = data.city_name;
        projectData.country = data.country_code;

// forecast data points
        let tomorrow = data.data[1];
        let returnDay = req.body.daysTillRet;
        // let duration = req.body.duration;
        // let arrivalDayIndex = req.body.daysTillDep;

        forecast(returnDay, tomorrow, data)

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

function forecast(returnDay, tomorrow, data) {
    if (returnDay >= 7) {

        function currentWeather(tomorrow, data) {
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

            // today
            // from https://stackoverflow.com/questions/40232218/how-to-reverse-date-format-yyyy-mm-dd-using-javascript-jquery
            date = data.data[0].valid_date;
            date00 = date.split("-").reverse().join("-");
            projectData.date0 = date00;

            projectData.currentTemp = data.data[0].temp;
            projectData.currentLowTemp = data.data[0].low_temp;
            projectData.currentHighTemp = data.data[0].high_temp;
            projectData.currentDescription = data.data[0].weather.description;
            projectData.currentIcon = data.data[0].weather.icon;
            // tomorrow
            date = data.data[1].valid_date
            date01 = date.split("-").reverse().join("-");
            projectData.date1 = date01

            projectData.tomorrowTemp = tomorrow.temp;
            projectData.tomorrowLowTemp = tomorrow.low_temp;
            projectData.tomorrowHighTemp = tomorrow.high_temp;
            projectData.tomorrowDescription = tomorrow.weather.description;
            projectData.tomorrowIcon = tomorrow.weather.icon;
            // day2
            date = data.data[2].valid_date
            date02 = date.split("-").reverse().join("-");
            projectData.date2 = date02

            projectData.arrival_2_temp = data.data[2].temp,
            projectData.arrival_2_lowTemp = data.data[2].low_temp,
            projectData.arrival_2_highTemp = data.data[2].high_temp,
            projectData.arrival_2_description = data.data[2].weather.description,
            projectData.arrival_2_icon = data.data[2].weather.icon;
            // day3
            date = data.data[3].valid_date
            date03 = date.split("-").reverse().join("-");
            projectData.date3 = date03

            projectData.arrival_3_temp = data.data[3].temp,
            projectData.arrival_3_lowTemp = data.data[3].low_temp,
            projectData.arrival_3_highTemp = data.data[3].high_temp,
            projectData.arrival_3_description = data.data[3].weather.description,
            projectData.arrival_3_icon = data.data[3].weather.icon;
            // day4
            date = data.data[4].valid_date
            date04 = date.split("-").reverse().join("-");
            projectData.date4 = date04

            projectData.arrival_4_temp = data.data[4].temp,
            projectData.arrival_4_lowTemp = data.data[4].low_temp,
            projectData.arrival_4_highTemp = data.data[4].high_temp,
            projectData.arrival_4_description = data.data[4].weather.description,
            projectData.arrival_4_icon = data.data[4].weather.icon;
            // day5
            date = data.data[5].valid_date
            date05 = date.split("-").reverse().join("-");
            projectData.date5 = date05

            projectData.arrival_5_temp = data.data[5].temp,
            projectData.arrival_5_lowTemp = data.data[5].low_temp,
            projectData.arrival_5_highTemp = data.data[5].high_temp,
            projectData.arrival_5_description = data.data[5].weather.description,
            projectData.arrival_5_icon = data.data[5].weather.icon;
            // day6
            date = data.data[6].valid_date
            date06 = date.split("-").reverse().join("-");
            projectData.date6 = date06

            projectData.arrival_6_temp = data.data[6].temp,
            projectData.arrival_6_lowTemp = data.data[6].low_temp,
            projectData.arrival_6_highTemp = data.data[6].high_temp,
            projectData.arrival_6_description = data.data[6].weather.description,
            projectData.arrival_6_icon = data.data[6].weather.icon;
        }
    }


  // // from https://knowledge.udacity.com/questions/474485
        // // an array to store this data:
        // const WeatherDataArray = data.data
        // const tripWeatherArray = []
        // console.log(arrivalDayIndex)
        // console.log(duration)
        // // = 8 - 4 = 4 days from today
        // // So in our example, we'll start from this index i.e index 4
        // for(let i = arrivalDayIndex; i <= duration; i++ ){
        //     tripWeatherArray.push(WeatherDataArray[i])
        //     }
        // // Now you can iterate through this array to display the desired data:
        //     tripWeatherArray.map(dayData =>{
        // // dayData contains data for each day in the trip
        //     const tempArray = Object.values(dayData.temp);
        //     console.log(tempArray)
        //     console.log(typeof tempArray)
        //     tempArray[0] = projectData.arrival_0_temp;
        //     tempArray[1] = projectData.arrival_1_temp
        //     dayData.low_temp;
        //     dayData.high_temp;
        //     dayData.weather.description;
        //     dayData.weather.icon;
            

        //     console.log(dayData.temp, dayData.low_temp, dayData.high_temp)
        //         })
 

              // projectData.arrival_0_temp = data.data[arrivalDayIndex].temp;
            // projectData.arrival_0_lowTemp = data.data[arrivalDayIndex].low_temp;
            // projectData.arrival_0_highTemp = data.data[arrivalDayIndex].high_temp;
            // projectData.arrival_0_description = data.data[arrivalDayIndex].weather.description;
            // projectData.arrival_0_icon = data.data[arrivalDayIndex].weather.icon;

            //     function weatherTrip(arrivalDayIndex, returnDay) {
            //         let arrival0 = data.data[arrivalDayIndex]
            //         let arrival1 = Math.abs(arrivalDayIndex + 1);
            //         let arrival2 = Math.abs(arrivalDayIndex + 2);
            //         let arrival3 = Math.abs(arrivalDayIndex + 3);
            //         let arrival4 = Math.abs(arrivalDayIndex + 4);
            //         let arrival5 = Math.abs(arrivalDayIndex + 5);
            //         let arrival6 = Math.abs(arrivalDayIndex + 6);
            //         console.log(arrivalDayIndex)
            //         console.log(arrival6)
            //         let day1 = (arrival1, returnDay) => {
            //             if (arrival1 <= returnDay){

            //             return projectData.arrival_1_temp = data.data[arrival1].temp,
            //             projectData.arrival_1_lowTemp = data.data[arrival1].low_temp,
            //             projectData.arrival_1_highTemp = data.data[arrival1].high_temp,
            //             projectData.arrival_1_description = data.data[arrival1].weather.description,
            //             projectData.arrival_1_icon = data.data[arrival1].weather.icon;
            //             }
            //         };
            //             day1(arrival1,returnDay)

            //         let day2 = (arrival2, returnDay) => {
            //             if (arrival2 <= returnDay) {

            //             return projectData.arrival_2_temp = data.data[arrival2].temp,
            //             projectData.arrival_2_lowTemp = data.data[arrival2].low_temp,
            //             projectData.arrival_2_highTemp = data.data[arrival2].high_temp,
            //             projectData.arrival_2_description = data.data[arrival2].weather.description,
            //             projectData.arrival_2_icon = data.data[arrival2].weather.icon;
            //             }
            //         };
            //             day2(arrival2,returnDay)

            //         let day3 = (arrival3, returnDay) => {
            //         if (arrival3 <= returnDay) {

                        // return projectData.arrival_3_temp = data.data[arrival3].temp,
                        // projectData.arrival_3_lowTemp = data.data[arrival3].low_temp,
                        // projectData.arrival_3_highTemp = data.data[arrival3].high_temp,
                        // projectData.arrival_3_description = data.data[arrival3].weather.description,
                        // projectData.arrival_3_icon = data.data[arrival3].weather.icon;
            //             }
            //         };
            //             day3(arrival3,returnDay)

            //         let day4 = (arrival4, returnDay) => {
            //             if (arrival4 <= returnDay) {

            //                 return projectData.arrival_4_temp = data.data[arrival4].temp,
            //                 projectData.arrival_4_lowTemp = data.data[arrival4].low_temp,
            //                 projectData.arrival_4_highTemp = data.data[arrival4].high_temp,
            //                 projectData.arrival_4_description = data.data[arrival4].weather.description,
            //                 projectData.arrival_4_icon = data.data[arrival4].weather.icon;
            //                 }
            //             };
            //             day4(arrival4,returnDay)

            //         let day5 = (arrival5, returnDay) => {
            //             if (arrival5 <= returnDay) {

                            // return projectData.arrival_5_temp = data.data[arrival5].temp,
                            // projectData.arrival_5_lowTemp = data.data[arrival5].low_temp,
                            // projectData.arrival_5_highTemp = data.data[arrival5].high_temp,
                            // projectData.arrival_5_description = data.data[arrival5].weather.description,
                            // projectData.arrival_5_icon = data.data[arrival5].weather.icon;
            //                 }
            //             };
            //             day5(arrival5,returnDay)

            //         let day6 = (arrival6, returnDay) => {
            //         if (arrival6 <= returnDay) {

                            // return projectData.arrival_6_temp = data.data[arrival6].temp,
                            // projectData.arrival_6_lowTemp = data.data[arrival6].low_temp,
                            // projectData.arrival_6_highTemp = data.data[arrival6].high_temp,
                            // projectData.arrival_6_description = data.data[arrival6].weather.description,
                            // projectData.arrival_6_icon = data.data[arrival6].weather.icon;
            //                 }
            //             };
            //             day6(arrival6,returnDay)
            //     }
            //     weatherTrip(arrivalDayIndex, returnDay)