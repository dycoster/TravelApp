
async function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let userDestination = document.getElementById('uiLocation').value
    console.log(`user entered: ${userDestination}`)
    let userDeparture = document.getElementById('uiDeparture').value
    console.log(`user entered: ${userDeparture}`)
    let userReturn = document.getElementById('uiReturn').value
    console.log(`user entered: ${userReturn}`)

    // From Project 4

    console.log("::: Form Submitted :::");

    // GeoNames API request
    getCoords(userDestination)

    // post userInput to serverside, inspiration from project3
    .then (function(data) {
        postCoords('http://localhost:3030/add', {
            placeName: data.geonames[0].name,
            lat: data.geonames[0].lat,
            long: data.geonames[0].lng,
            country: data.geonames[0].countryName})

        .then(function(newData) {
            postWeather('http://localhost:3030/weather', {
                name: data.city_name,
                country_code: data.country_code,
                temp: data.data[0].temp,
                description: data[0].weather.description,
                icon: data[0].weather.icon })
        })
    })

    // post weather API Data



    // PixaBay API request


};



// geoNames API call
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

const postWeather = async (url = '', data = {})=> {
    const response = await fetch (url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData;

    }catch (error) {
        console.log("error", error);
    }
}
// const updateUI = async () => {
//     const request = await fetch('http://localhost:3030/all');
//     try{
//         const allData = await request.json();
//         console.log(allData)
//     }
//     catch (error) {
//         console.log("error", error);
//     }
// };

export {
    handleSubmit,
    getCoords,
    postCoords,
    postWeather
 }