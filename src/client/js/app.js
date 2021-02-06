// // Insiration from https://www.youtube.com/watch?v=wPElVpR1rwA&t=1640s

function performAction() {

    let long;
    let lat;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(lat, long)

            const wbApi = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${long}&key=5f6318133b1e4773bb68e669f73545bd`

            fetch(wbApi, {
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                }})
                .then (res => res.json())
                .then (data => {
                    console.log(data)
                    document.getElementById('locationResultCurrent').innerHTML = `<span>${data.city_name}</span>, ${data.country_code}`;
                    document.getElementById('iconResultCurrent').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`);
                    document.getElementById('tempResultCurrent').innerHTML = `<span>${data.data[0].temp}</span>  °C`;
                    document.getElementById('descriptionCurrent').innerHTML = `<span>${data.data[0].weather.description}</span>`;
                    document.getElementById('highTempCurrent').innerHTML = `max: <span>${data.data[0].high_temp}</span> °C`;
                    document.getElementById('lowTempCurrent').innerHTML = `min: <span>${data.data[0].low_temp}</span> °C`;

                    document.getElementById('iconResultTomorrow').setAttribute('src',`https://www.weatherbit.io/static/img/icons/${data.data[1].weather.icon}.png`);
                    document.getElementById('tempResultTomorrow').innerHTML = `<span>${data.data[1].temp}</span>  °C`;
                    document.getElementById('descriptionTomorrow').innerHTML = `<span>${data.data[1].weather.description}</span>`;
                    document.getElementById('highTempTomorrow').innerHTML = `max: <span>${data.data[1].high_temp}</span> °C`;
                    document.getElementById('lowTempTomorrow').innerHTML = `min: <span>${data.data[1].low_temp}</span> °C`;

                })
        });
    } else {
        let currentDiv = document.getElementById('current')
        currentDiv.style.display = "none";
                }
};


export { performAction }

