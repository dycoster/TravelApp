/* Global Variables */


// Create a new date instance dynamically with JS
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let d = new Date();
let newDate = d.getDate()+' '+ monthNames[d.getMonth()]+' '+ d.getFullYear();



function performAction(e) {
    const newZip = document.getElementById('zip').value;
    const newFeeling = document.getElementById('feelings').value;

    const baseURL = `http://api.openweathermap.org/data/2.5/weather?zip=${newZip},us&appid=`
    const apiKey = 'f2e89ddc1b6bbdf69468c5b14dccd167&units=metric';

getWeather(baseURL, apiKey)

.then (function(data) {
    postData('http://localhost:3030/add', {name: data.name, temperature: data.main.temp, date: newDate, user_response: newFeeling, icon: data.weather[0].icon})
})
.then(function(newData) {
    updateUI()
})
}

// Fetch openweatherMap API
const getWeather = async (baseURL, apiKey) => {

    const res = await fetch(baseURL+apiKey);
    try {

        const data = await res.json();
        console.log(data)
        return data;
    } catch(error) {
        console.log("error", error);
    }
  }


// Async POST request

const postData = async (url = '', data = {})=> {
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

// Update UI async

const updateUI = async () => {
    const request = await fetch('http://localhost:3030/all');
    try{
        const allData = await request.json();
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('name').innerHTML = allData.name;
        document.getElementById('temp').innerHTML = `${allData.temperature}°C`;
        document.getElementById('content').innerHTML = `Feeling: ${allData.user_response}`;
        document.getElementById('icon').setAttribute('src',`http://openweathermap.org/img/wn/${allData.icon}@2x.png`);
        console.log(allData)
    }
    catch (error) {
        console.log("error", error);
    }
};





