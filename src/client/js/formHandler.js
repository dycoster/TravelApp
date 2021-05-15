
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

    console.log("days till departure: " + daysTillDep + " days");
    console.log("duration: " + diffDays + " days");

    // Set display
    toggleDisplay(daysTillDep,currentDiv,forecastDiv)

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

        if (daysTillDep = 0) {
            day0.style.display = "flex";
            currentDiv.style.display = "none";
            forecastDiv.style.display = "flex";
        }
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
async function getImage (userDestination) {


    let imageUrl = `https://pixabay.com/api/?key=20000501-dad6322171b2d4f4f813207da&q=${userDestination}&image_type=photo`

    const response = await fetch(imageUrl)

    try {
        const data = await response.json()

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
        
        document.getElementById('day0').innerHTML =
            `<div class="date" id="date0">${allData.dates[0]}</div>
            <div class="temp" id="tempResultForecast">${allData.temps[0]}</div>
            <div class="description" id="descriptionForecast">${allData.descriptions[0]}</div>
            <div class="highTemp" id="highTempForecast">${allData.high_temps[0]}</div>
            <div class="lowTemp" id="lowTempForecast">${allData.low_temps[0]}</div>
            <img class="icon" id="iconResultForecast">${allData.icons[0]}`;
    

        document.getElementById('day1').innerHTML =
            `<div class="date" id="date1">${allData.dates[1]}</div>
            <div class="temp" id="tempResultForecast1">${allData.temps[1]}</div>
            <div class="description" id="descriptionForecast1">${allData.descriptions[1]}</div>
            <div class="highTemp" id="highTempForecast1">${allData.high_temps[1]}</div>
            <div class="lowTemp" id="lowTempForecast1">${allData.low_temps[1]}</div>
            <img class="icon" id="iconResultForecast1">${allData.icons[1]}`;
        


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
