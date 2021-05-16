
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

    // FourSquare API request
    await getVenues(userDestination)

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

// Toggle results display
function toggleDisplay(daysTillDep,currentDiv, forecastDiv) {
    if (daysTillDep > 6) {
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

// from https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
        let randomNumber = Math.floor(Math.random() * 20) + 1;
        let dataSelector = data.hits[randomNumber];

        document.getElementById('photo').style.backgroundImage = `url(${dataSelector.largeImageURL})`;

    } catch (error) {
        console.log('error', error)
    }
}

// fourSquare API request
async function getVenues(userDestination) {

    const clientId = 'HWHFITMTCVG3XJAVCWLGOZOQHAUWX3TY3L1X3VXWJXXKSTGM';
    const clientSecret = 'EASKFELNBDDDNZDQXTMEVCRYF1BXYVRMYVKXFKNN0WCYYPBJ';
    const url = 'https://api.foursquare.com/v2/venues/explore?near=';

    let venueUrl = `${url}${userDestination}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20210222`;

    const response = await fetch(venueUrl);
        try {
            const venueData = await response.json();
            const venues = venueData.response.groups[0].items.map(item => item.venue);

            for (let i = 0; i < 4; i++) {
                document.getElementById('fourSquare').style.display = "flex";
                const venueId = `venue${i}`;
                  document.getElementById(venueId).innerHTML =
                  `<h3>${venues[i].name}</h3>
                  <img class="venueimage" src="${venues[i].categories[0].icon.prefix}bg_64${venues[i].categories[0].icon.suffix}"/>
                  <h3>Address:</h3>
                  <p>${venues[i].location.address}</p>
                  <p>${venues[i].location.city}</p>
                  <p>${venues[i].location.country}</p>`;
                }
  }

  catch(error) {
    console.log(error)
  }
};


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

    // Todays weather
        document.getElementById('locationResultCurrent').innerHTML = `<span>${allData.placeName}</span>, ${allData.country};`
        document.getElementById('today').innerHTML =
        `<td class="date"><span>${allData.todayDate}</span></td>
        <td class="temp"><span>${allData.todayTemp}</span> °C</td>
        <td class="description"><span>${allData.todayDescription}</span></td>
        <td>
            <img class="icon" src="https://www.weatherbit.io/static/img/icons/${allData.todayIcon}.png"/>
        </td>`;

    // Forecasted weather
        document.getElementById('locationResultForecast').innerHTML = `<span>${allData.placeName}</span>, ${allData.country};`

        for (let i = 0; i < 5; i++) {
            const divId = `day${i}`;
              document.getElementById(divId).innerHTML =
              `<td class="date"><span>${allData.dates[i]}</span></td>
                <td class="temp"><span>${allData.temps[i]}</span> °C</td>
                <td class="description"><span>${allData.descriptions[i]}</span></td>
                <td>
                    <img class="icon" src="https://www.weatherbit.io/static/img/icons/${allData.icons[i]}.png"/>
                </td>`;
            }

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
