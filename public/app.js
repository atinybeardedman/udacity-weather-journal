// Personal API Key for OpenWeatherMap API
const key = '67384f21e65fdc35f6823c8871caa7c6';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
// constants of html elements used in various functions
const feelingsEL = document.getElementById('feelings');
const zipEl = document.getElementById('zip');
const button = document.getElementById('generate');

const dateEl = document.getElementById('date');
const tempEl = document.getElementById('temp');
const contentEl = document.getElementById('content');
const entryEl = document.getElementById('entryHolder');

// Helper functions

function buildURL(zip) {
    const args = [{
            param: 'zip',
            value: zip
        },
        {
            param: 'units',
            value: 'imperial'
        },
        {
            param: 'appid',
            value: key
        }
    ];
    let url = baseURL + '?';
    for (const arg of args) {
        url += `${arg.param}=${arg.value}`;
        url += '&';
    }
    // strip off extra & at the end
    url = url.slice(0, url.length - 1);
    return url;
}

// Event listener to add function to existing HTML DOM element
button.addEventListener('click', generate);

/* Function to GET Web API Data*/
const getWeather = async (zip) => {
    const response = await fetch(buildURL(zip));
    const data = await response.json();
    return data.main.temp;
}

/* Function to POST data */
const addEntry = async (feelings, temp) => {
    const postBody = {
        date: new Date(),
        temp,
        content: feelings
    };
    const resp = await fetch('/newEntry', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
    });
    try {
        if (resp.ok) {
            return
        }
    } catch (error) {
        console.log(error);
    }
}

/* Function called by event listener */
function generate(event) {
    event.preventDefault();
    const feelings = feelingsEL.value;
    const zip = zipEl.value;
    getWeather(zip)
        .then(temp =>
            addEntry(feelings, temp)
        ).then(() =>
            getProjectData()
        );
}


/* Function to GET Project Data */

const getProjectData = async () => {
    const resp = await fetch('/all', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await resp.json();
    try {
        if(JSON.stringify(data) !== '{}'){
            return updateUI(data);
        } else {
            return clearUI();
        }
    } catch (error) {
        console.log(error);
    }
}

const updateUI = (data) => {
    // first clear out the form
    clearUI();
    // show entry container
    entryEl.classList.remove('is-hidden');
    // propagate data into the entry container
    const { date, temp, content } = data.entry;
    const dateObj = new Date(date);
    dateEl.innerHTML = dateObj.toLocaleDateString();
    tempEl.innerHTML = temp;
    contentEl.innerHTML = content;

}

const clearUI = () => {
    zipEl.value = '';
    feelingsEL.value = '';
    entryEl.classList.add('is-hidden');
}

// always start by updating UI on page load with project data
getProjectData();