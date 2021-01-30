import { performAction } from './js/app'
import { handleSubmit, getImage, getCoords, postCoords, updateUI } from './js/formHandler'
import './styles/body.scss'


// add eventlistener with callback action
document.getElementById('submit').addEventListener('click', handleSubmit);

// moved to index.js as suggested in https://knowledge.udacity.com/questions/435694

    // Check that service workers are supported
    // if ('serviceWorker' in navigator) {
        // Use the window load event to keep the page load performant
    //     window.addEventListener('load', () => {
    //         console.log('Installing service workers')
    //         navigator.serviceWorker.register('/service-worker.js');
    //     });
    // }

    export {
        performAction,
        handleSubmit,
        getImage,
        getCoords,
        postCoords,
        updateUI
    }