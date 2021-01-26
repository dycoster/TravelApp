
function handleSubmit(event) {
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

    // post userInput to serverside, these threads have been helpfull to me https://knowledge.udacity.com/questions/314461 and https://knowledge.udacity.com/questions/127378
        fetch ('http://localhost:3030/add', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({location: userDestination, depart: userDeparture, return: userReturn}),
        })

        .then (res => res.json())
}

export { handleSubmit }