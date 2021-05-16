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
                    document.getElementById('current').style.display = "flex";

                    document.getElementById('locationResultCurrent').innerHTML = `<span>${data.city_name}</span>, ${data.country_code}`;
                    document.getElementById('today').innerHTML =
                    `<td class="temp"><span>${data.data[0].temp}</span> °C</td>
                    <td class="description"><span>${data.data[0].weather.description}</span></td>
                    <td>
                        <img class="icon" src="https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png"/>
                    </td>`;
                })
        });
    } else {
        let currentDiv = document.getElementById('current')
        currentDiv.style.display = "none";
                }
};


export { performAction }



