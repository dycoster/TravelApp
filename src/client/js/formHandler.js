
async function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let userDestination = document.getElementById('uiLocation').value
    console.log(`user entered: ${userDestination}`)
    let userDeparture = document.getElementById('uiDeparture').value
    console.log(`user entered: ${userDeparture}`)
    let userReturn = document.getElementById('uiReturn').value
    console.log(`user entered: ${userReturn}`)
    let currentDiv = document.getElementById('current')
    let forecastDiv = document.getElementById('forecast')

    // Set display of forecastDivs
    const day0 = document.getElementById('day0')
    const day1 = document.getElementById('day1')
    const day2 = document.getElementById('day2')
    const day3 = document.getElementById('day3')
    const day4 = document.getElementById('day4')
    const day5 = document.getElementById('day5')
    const day6 = document.getElementById('day6')


    // Inspiration from https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/

    // Countdown
    const today = new Date()
    const date1 = new Date(userDeparture);
    const date2 = new Date(userReturn);
    const timeTillDep = Math.abs(date1 - today);
    const daysTillDep = Math.ceil(timeTillDep / (1000 * 60 * 60 * 24));
    const timeTillRet = Math.abs(date2 - today);
    const daysTillRet = Math.ceil(timeTillRet / (1000 * 60 * 60 * 24));
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log(daysTillDep + " days");
    console.log(diffDays + " days");

    // Set display
    toggleDisplay(daysTillDep,daysTillRet, currentDiv,forecastDiv)

    // PixaBay API request
    await getImage(userDestination)

    // GeoNames API request
    await getCoords(userDestination)

    // post userInput to serverside, inspiration from project3 Unsure how to refactor to await and arrow functions..
    // have tried suggestions from https://stackoverflow.com/questions/42964102/syntax-for-async-arrow-function
    .then (function(data) {
        postCoords('http://localhost:3030/add', {
            placeName: data.geonames[0].name,
            lat: data.geonames[0].lat,
            long: data.geonames[0].lng,
            country: data.geonames[0].countryName,
            daysTillDep: daysTillDep,
            daysTillRet: daysTillRet,
            duration: diffDays})

        .then(function(newData) {
            updateUI()
        })
    })
};

const toggleDisplay = (daysTillDep, daysTillRet, currentDiv, forecastDiv) => {
    if (daysTillDep >= 6) {
        currentDiv.style.display = "flex";
        forecastDiv.style.display = "none";
    } else if (daysTillDep < 6 && daysTillRet > 6 ) {
        currentDiv.style.display = "flex";
        forecastDiv.style.display = "none";
    } else {

        // if (daysTillDep = 0) {
        //     day0.style.display = "flex";
        //     // currentDiv.style.display = "none";
        //     // forecastDiv.style.display = "flex";
        // }
        if (daysTillDep > 0) {
            day0.style.display = "none";
            currentDiv.style.display = "none";
            forecastDiv.style.display = "flex";
        } else {day0.style.display = "flex"}

        if (daysTillDep > 1) {
            day1.style.display = "none";
        } else {day1.style.display = "flex"}

        if (daysTillDep > 2) {
            day2.style.display = "none";
        } else {day2.style.display = "flex"}

        if (daysTillDep > 3) {
            day3.style.display = "none"
        } else {day3.style.display = "flex"}

        if (daysTillDep > 4) {
            day4.style.display = "none"
        } else {day4.style.display = "flex"}

        if (daysTillDep > 5) {
            day5.style.display = "none"
        } else {day5.style.display = "flex"}

        if (daysTillDep > 6) {
            day6.style.display = "none"
        } else {day6.style.display = "flex"}
    }
};

// PixaBay API Request
const getImage = async(userDestination) => {


    let imageUrl = `https://pixabay.com/api/?key=20000501-dad6322171b2d4f4f813207da&q=${userDestination}&image_type=photo`

    const response = await fetch(imageUrl)

    try {
        const data = await response.json()
        console.log(data)
// from https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
        let randomNumber = Math.floor(Math.random() * 20) + 1;
        let dataSelector = data.hits[randomNumber];

        document.getElementById('photo').style.backgroundImage = `url(${dataSelector.largeImageURL})`;

    } catch (error) {
        console.log('error', error)
    }
}


// geoNames API Request
const getCoords = async(userDestination) => {

    let geoUrl = `http://api.geonames.org/searchJSON?q=${userDestination}&maxRows=1&username=dycoster`;

    const response = await fetch (geoUrl);

            try {
                const data = await response.json();
                console.log(data);
                return data;

            } catch (error) {
                console.log('error', error)
            }
};

const postCoords = async (url = '', data = {})=> {
    const response = await fetch (url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log(newData);
        return newData;

    }catch (error) {
        console.log("error", error);
    }
};


const updateUI = async () => {
    const request = await fetch('http://localhost:3030/all');
    try{
        const allData = await request.json();
        console.log(allData)

// today's weather
        document.getElementById('locationResultCurrent').innerHTML = `<span>${allData.placeName}</span>, ${allData.country}`;
        document.getElementById('iconResultCurrent').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.currentIcon}.png`);
        document.getElementById('tempResultCurrent').innerHTML = `<span>${allData.currentTemp}</span> °C`;
        document.getElementById('descriptionCurrent').innerHTML = `<span>${allData.currentDescription}</span>`;
        document.getElementById('highTempCurrent').innerHTML = `max: <span>${allData.currentHighTemp}</span> °C`;
        document.getElementById('lowTempCurrent').innerHTML = `min: <span>${allData.currentLowTemp}</span> °C`;

// tomorrow's weather
        document.getElementById('iconResultTomorrow').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.tomorrowIcon}.png`);
        document.getElementById('tempResultTomorrow').innerHTML = `<span>${allData.tomorrowTemp}</span> °C`;
        document.getElementById('descriptionTomorrow').innerHTML = `<span>${allData.tomorrowDescription}</span>`;
        document.getElementById('highTempTomorrow').innerHTML = `max: <span>${allData.tomorrowHighTemp}</span> °C`;
        document.getElementById('lowTempTomorrow').innerHTML = `min: <span>${allData.tomorrowLowTemp}</span> °C`;

// Day 0
        document.getElementById('durationTrip').innerHTML = `You'll be staying for ${allData.duration} days`
        document.getElementById('date0').innerHTML = `${allData.date0}`;
        document.getElementById('locationResultForecast').innerHTML = `<span>${allData.placeName}</span>, ${allData.country}`;
        document.getElementById('iconResultForecast').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.currentIcon}.png`);
        document.getElementById('tempResultForecast').innerHTML = `<span>${allData.currentTemp}</span>  °C`;
        document.getElementById('descriptionForecast').innerHTML = `<span>${allData.currentDescription}</span>`;
        document.getElementById('highTempForecast').innerHTML = `max: <span>${allData.currentHighTemp}</span> °C`;
        document.getElementById('lowTempForecast').innerHTML = `min: <span>${allData.currentLowTemp}</span> °C`;

// Day 1
        document.getElementById('date1').innerHTML = `${allData.date1}`;
        document.getElementById('iconResultForecast1').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.tomorrowIcon}.png`);
        document.getElementById('tempResultForecast1').innerHTML = `<span>${allData.tomorrowTemp}</span>  °C`;
        document.getElementById('descriptionForecast1').innerHTML = `<span>${allData.tomorrowDescription}</span>`;
        document.getElementById('highTempForecast1').innerHTML = `max: <span>${allData.tomorrowHighTemp}</span> °C`;
        document.getElementById('lowTempForecast1').innerHTML = `min: <span>${allData.tomorrowLowTemp}</span> °C`;

 // Day 2
        document.getElementById('date2').innerHTML = `${allData.date2}`;
        document.getElementById('iconResultForecast2').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.arrival_2_icon}.png`);
        document.getElementById('tempResultForecast2').innerHTML = `<span>${allData.arrival_2_temp}</span>  °C`;
        document.getElementById('descriptionForecast2').innerHTML = `<span>${allData.arrival_2_description}</span>`;
        document.getElementById('highTempForecast2').innerHTML = `max: <span>${allData.arrival_2_highTemp}</span> °C`;
        document.getElementById('lowTempForecast2').innerHTML = `min: <span>${allData.arrival_2_lowTemp}</span> °C`;

 // Day 3
        document.getElementById('date3').innerHTML = `${allData.date3}`;
        document.getElementById('iconResultForecast3').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.arrival_3_icon}.png`);
        document.getElementById('tempResultForecast3').innerHTML = `<span>${allData.arrival_3_temp}</span>  °C`;
        document.getElementById('descriptionForecast3').innerHTML = `<span>${allData.arrival_3_description}</span>`;
        document.getElementById('highTempForecast3').innerHTML = `max: <span>${allData.arrival_3_highTemp}</span> °C`;
        document.getElementById('lowTempForecast3').innerHTML = `min: <span>${allData.arrival_3_lowTemp}</span> °C`;

// Day 4
        document.getElementById('date4').innerHTML = `${allData.date4}`;
        document.getElementById('iconResultForecast4').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.arrival_4_icon}.png`);
        document.getElementById('tempResultForecast4').innerHTML = `<span>${allData.arrival_4_temp}</span>  °C`;
        document.getElementById('descriptionForecast4').innerHTML = `<span>${allData.arrival_4_description}</span>`;
        document.getElementById('highTempForecast4').innerHTML = `max: <span>${allData.arrival_4_highTemp}</span> °C`;
        document.getElementById('lowTempForecast4').innerHTML = `min: <span>${allData.arrival_4_lowTemp}</span> °C`;

// Day 5
        document.getElementById('date5').innerHTML = `${allData.date5}`;
        document.getElementById('iconResultForecast5').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.arrival_5_icon}.png`);
        document.getElementById('tempResultForecast5').innerHTML = `<span>${allData.arrival_5_temp}</span>  °C`;
        document.getElementById('descriptionForecast5').innerHTML = `<span>${allData.arrival_5_description}</span>`;
        document.getElementById('highTempForecast5').innerHTML = `max: <span>${allData.arrival_5_highTemp}</span> °C`;
        document.getElementById('lowTempForecast5').innerHTML = `min: <span>${allData.arrival_5_lowTemp}</span> °C`;

// Day 6
        document.getElementById('date6').innerHTML = `${allData.date6}`;
        document.getElementById('iconResultForecast6').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.arrival_6_icon}.png`);
        document.getElementById('tempResultForecast6').innerHTML = `<span>${allData.arrival_6_temp}</span>  °C`;
        document.getElementById('descriptionForecast6').innerHTML = `<span>${allData.arrival_6_description}</span>`;
        document.getElementById('highTempForecast6').innerHTML = `max: <span>${allData.arrival_6_highTemp}</span> °C`;
        document.getElementById('lowTempForecast6').innerHTML = `min: <span>${allData.arrival_6_lowTemp}</span> °C`;


    }
    catch (error) {
        console.log("error", error);
    }
};

export {
    toggleDisplay,
    handleSubmit,
    getImage,
    getCoords,
    postCoords,
    updateUI
 }