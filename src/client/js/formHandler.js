
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
    // currentDiv.style.display = "none"
    let forecastDiv = document.getElementById('forecast')
    // forecastDiv.style.display = "flex";

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
    toggleDisplay(daysTillDep,currentDiv,forecastDiv)

    // From Project 4

    console.log("::: Form Submitted :::");

    // PixaBay API request
    await getImage(userDestination)

    // GeoNames API request
    await getCoords(userDestination)

    // post userInput to serverside, inspiration from project3
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

function toggleDisplay(daysTillDep,currentDiv, forecastDiv) {
    if (daysTillDep >= 6) {
        currentDiv.style.display = "flex";
        forecastDiv.style.display = "none";
    } else {
        currentDiv.style.display = "none";
        forecastDiv.style.display = "flex";
    }
};

// PixaBay API Request
async function getImage (userDestination) {


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
async function getCoords(userDestination) {

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
}


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

// Weather on day of arrival
        document.getElementById('locationResultForecast').innerHTML = `<span>${allData.placeName}</span>, ${allData.country}`;
        document.getElementById('iconResultForecast').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.arrival_0_icon}.png`);
        document.getElementById('tempResultForecast').innerHTML = `<span>${allData.arrival_0_temp}</span>  °C`;
        document.getElementById('descriptionForecast').innerHTML = `<span>${allData.arrival_0_description}</span>`;
        document.getElementById('highTempForecast').innerHTML = `max: <span>${allData.arrival_0_highTemp}</span> °C`;
        document.getElementById('lowTempForecast').innerHTML = `min: <span>${allData.arrival_0_lowTemp}</span> °C`;

// Day 1
        document.getElementById('iconResultForecast1').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.arrival_1_icon}.png`);
        document.getElementById('tempResultForecast1').innerHTML = `<span>${allData.arrival_1_temp}</span>  °C`;
        document.getElementById('descriptionForecast1').innerHTML = `<span>${allData.arrival_1_description}</span>`;
        document.getElementById('highTempForecast1').innerHTML = `max: <span>${allData.arrival_1_highTemp}</span> °C`;
        document.getElementById('lowTempForecast1').innerHTML = `min: <span>${allData.arrival_1_lowTemp}</span> °C`;

 // Day 2
 document.getElementById('iconResultForecast2').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.arrival_2_icon}.png`);
 document.getElementById('tempResultForecast2').innerHTML = `<span>${allData.arrival_2_temp}</span>  °C`;
 document.getElementById('descriptionForecast2').innerHTML = `<span>${allData.arrival_2_description}</span>`;
 document.getElementById('highTempForecast2').innerHTML = `max: <span>${allData.arrival_2_highTemp}</span> °C`;
 document.getElementById('lowTempForecast2').innerHTML = `min: <span>${allData.arrival_2_lowTemp}</span> °C`;

 // Day 3
 document.getElementById('iconResultForecast3').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.arrival_3_icon}.png`);
 document.getElementById('tempResultForecast3').innerHTML = `<span>${allData.arrival_3_temp}</span>  °C`;
 document.getElementById('descriptionForecast3').innerHTML = `<span>${allData.arrival_3_description}</span>`;
 document.getElementById('highTempForecast3').innerHTML = `max: <span>${allData.arrival_3_highTemp}</span> °C`;
 document.getElementById('lowTempForecast3').innerHTML = `min: <span>${allData.arrival_3_lowTemp}</span> °C`;
    }
    catch (error) {
        console.log("error", error);
    }
};

export {
    handleSubmit,
    getImage,
    getCoords,
    postCoords,
    updateUI
 }