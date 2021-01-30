
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

    // PixaBay API request
    getImage(userDestination)

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
            console.log(newData)
            updateUI()
        })
    })
};


// PixaBay API Request
async function getImage (userDestination) {


    let imageUrl = `https://pixabay.com/api/?key=20000501-dad6322171b2d4f4f813207da&q=${userDestination}&image_type=photo`

    const response = await fetch(imageUrl)

    try {
        const data = await response.json()
        console.log(data)
        document.getElementById('photo').style.backgroundImage = `url(${data.hits[3].largeImageURL})`;

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
        document.getElementById('locationResult').innerHTML = `<span>${allData.placeName}</span>, ${allData.country}`;
        document.getElementById('iconResult').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${allData.icon}.png`);
        document.getElementById('tempResult').innerHTML = `<span>${allData.temp}</span> °C`
    }
    catch (error) {
        console.log("error", error);
    }
};

export {
    handleSubmit,
    getCoords,
    postCoords,
 }