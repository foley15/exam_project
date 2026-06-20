const cityInput = document.getElementById('cityInput')
const searchBtn = document.querySelector('.search-btn')
const hero = document.querySelector('.hero')
const weatherDisplay = document.querySelector('.weather')
const forcast = document.querySelector('.forcast')
const forecastDaysContainer = document.querySelector('.forcast-days')
const loadingState = document.querySelector('.loading')

// Targeting the existing empty <p> elements in the HTML structure
const humidityDisplay = document.querySelector('.humidityDisplay')
const windDisplay = document.querySelector('.windDisplay')
const uvDisplay = document.querySelector('.uvDisplay')


//Get Weather Data
searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim()

    if(city) {
        try {
            showLoading()
            const weatherData = await getWeatherData(city)
            displayWeatherInfo(weatherData)
            hideLoading()
        }
        catch (error) {
            hideLoading()
            displayError(error.message)
        }
    }else {
        displayError('Please enter a valid city name')
    }
})

//Function to show loading...
function showLoading () {
    loadingState.style.display = 'block';
    hero.style.display = 'none';          
    weatherDisplay.style.display = 'none'; 
    forcast.style.display = 'none';
    forecastDaysContainer.style.display = 'none';
}

//Function to hide loading...
function hideLoading () {
    loadingState.style.display = 'none';
}
//Get Weather Data from API
async function getWeatherData(city) {
    const apiURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`

    const response = await fetch(apiURL)
    
    if(!response.ok) {
        throw new Error('Could not fetch weather data')
    }
    
    const data = await response.json()

    //Safety check: In case open meteor couldn't find the city
    if (!data.results || data.results.length === 0) {
        throw new Error('City not found. Try another one.')
    }
    
    return data
}

async function displayWeatherInfo(data) {

    // 1. Extract coordinates from the geocoding results
    const {results: [{name: city, country: country, latitude: latitude, longitude: longitude}]} = data
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`

    const result = await fetch(weatherURL)
    if(!result.ok) {
        throw new Error('Could not fetch weather data')
    }
    
    const finalWeatherData = await result.json()

    const {current: {temperature_2m, relative_humidity_2m, wind_speed_10m, uv_index, weather_code}, daily: { time, temperature_2m_max, temperature_2m_min, weather_code: daily_weather_codes }} = finalWeatherData

    hero.textContent = ''
    hero.style.display = 'block'

    weatherDisplay.style.display = 'flex'
    forcast.style.display = 'block'

    forecastDaysContainer.textContent = ''
    forecastDaysContainer.style.display = 'block'

    humidityDisplay.textContent = ''
    windDisplay.textContent = ''
    uvDisplay.textContent = ''

    const cityDisplay = document.createElement('p')
    const tempDisplay = document.createElement('p')
    const weatherIcon = document.createElement('p')
    const descDisplay = document.createElement('p')

    cityDisplay.textContent = `${city}, ${country}`
    tempDisplay.textContent = `${(temperature_2m).toFixed(0)}℃`
    weatherIcon.textContent = getWeatherIcon(weather_code)
    descDisplay.textContent = getWeatherDescription(weather_code, temperature_2m)
    humidityDisplay.textContent = `${relative_humidity_2m}%`
    windDisplay.textContent = `${wind_speed_10m} km/h`
    uvDisplay.textContent = getUVIndexCategory(uv_index)


    cityDisplay.classList.add('cityDisplay')
    tempDisplay.classList.add('tempDisplay')
    weatherIcon.classList.add('weather-icon')
    descDisplay.classList.add('descDisplay')
    humidityDisplay.classList.add('humidityDisplay')
    windDisplay.classList.add('windDisplay')
    uvDisplay.classList.add('uvDisplay')

    hero.appendChild(weatherIcon)
    hero.appendChild(cityDisplay)
    hero.appendChild(tempDisplay)
    hero.appendChild(descDisplay)

    //Get 5 days forcast using javaScript
    for (let i = 0; i < 5; i++) {
        const dayRow = document.createElement('div');
        dayRow.classList.add('days');

        // 1. Get Day Name (Today, Tuesday, etc.)
        let dayName;
        if (i === 0) {
            dayName = 'Today';
        } else {
            // Convert date strings ("2026-06-16") to readable day names
            const dateObj = new Date(time[i+1]);
            dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        }

        // 2. Fetch the correct daily icon using your existing function
        const dayIcon = getWeatherIcon(daily_weather_codes[i]);

        // 3. Setup structural elements inside each row
        dayRow.innerHTML = `
            <p class="day">${dayName}</p>
            <p class="weather-day">${dayIcon}</p>
            <div class="tempDay">
                <p class="first">${temperature_2m_max[i].toFixed(0)}°</p>
                <p class="second">${temperature_2m_min[i].toFixed(0)}°</p>
            </div>
        `;

        // 4. Append row to forecast container
        forecastDaysContainer.appendChild(dayRow);
    }
}

//Function to get UV_Index 
function getUVIndexCategory (uv_index) {
    if (uv_index < 0 || uv_index === null || uv_index === undefined) {
        return 'Invalid / Unknown';
    } else if (uv_index <= 2.9) {
        return 'Low';
    } else if (uv_index <= 5.9) {
        return 'Moderate';
    } else if (uv_index <= 7.9) {
        return 'High';
    } else if (uv_index <= 10.9) {
        return 'Very High';
    } else {
        return 'Extreme';
    }
}

//Function to get weather icon
function getWeatherIcon (weather_code) {
    switch(true) {
        case (weather_code === 0):
            return '☀️'
        case (weather_code === 1 || weather_code === 2 || weather_code === 3):
            return '⛅'
        case (weather_code === 45 || weather_code === 48):
            return '🌁'
        case (weather_code === 51 || weather_code === 53 || weather_code === 55):
            return '💦'
        case (weather_code === 61 || weather_code === 63 || weather_code === 65):
            return '🌧️'
        case (weather_code === 71 || weather_code === 73 || weather_code === 75):
            return '❄️'
        case (weather_code === 80 || weather_code === 81 || weather_code === 82):
            return '⛈️'
        default:
            return '🌨️'
    }
}

//Function to get weather description
function getWeatherDescription (weather_code, temperature_2m) {
const weatherDescriptions = {
  0: "Sunny", // Clear sky
  1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Foggy", 48: "Foggy",
  51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
  61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
  71: "Slight Snow Fall", 73: "Moderate Snow Fall", 75: "Heavy Snow Fall",
  80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
  95: "Thunderstorm"
};

const code = weather_code || 'Unknown Conditions'
const description = weatherDescriptions[code]
const currentTemp = temperature_2m

const outputstring = `${description}\u00A0 –  \u00A0Feels like ${currentTemp}℃`
return outputstring

}

//Function for displaying error message 
function displayError (message) {
hideLoading()
const errorMessage = document.createElement('p')
errorMessage.textContent = message
hero.textContent = ''
hero.style.display = 'block'
errorMessage.classList.add('errorDisplay')
hero.appendChild(errorMessage)
}

// Automatically run when the page loads
window.addEventListener('load', () => {

    //Setting default city on page load
    const defaultCity = "Lagos"

    //Show the loading page immediately on pageload
    showLoading()

    // Check if the browser supports Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            // Success! Grab latitude and longitude
            const lat = position.coords.latitude
            const lon = position.coords.longitude

            try {
                // Fetch and display local weather
                await getLocalWeatherData(lat, lon)
                hideLoading()
            } catch (error) {
                hideLoading()
                displayError("Could not fetch weather for your current location.");
            }
        }, (error) => {
            // If user denies permission, or location fails
            hideLoading()
            console.log("Geolocation rejected or failed:", error.message)
        });
    } else {
        console.log("Geolocation not supported. Loading default city:", defaultCity)
        hideLoading()
        loadDefaultCity()
    }
});

async function getLocalWeatherData(latitude, longitude) {
    let cityName = "Your Location"
    let countryName = "Local"

    try {
        // 1. Ask Open-Meteo's reverse geocoding API what city matches these coordinates
        const reverseGeocodeURL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        
        const geoResponse = await fetch(reverseGeocodeURL)
        if (geoResponse.ok) {
            const geoData = await geoResponse.json()
            
            // Extract city/town/village and country safely from the address object
            const address = geoData.address;
            cityName = address.city || address.town || address.village || "Unknown City"
            countryName = address.country || ""
        }
    } catch (e) {
        console.log("Could not reverse-geocode coordinates, falling back to default labels.")
    }

    // 2. Fetch the weather data just like before
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`

    const result = await fetch(weatherURL)
    if (!result.ok) {
        throw new Error('Could not fetch weather data')
    }
    
    const finalWeatherData = await result.json()

    // 3. Put the REAL city and country names we just looked up into our simulated mask
    const simulatedData = {
        results: [{
            name: cityName,
            country: countryName,
            latitude: latitude,
            longitude: longitude
        }]
    };

    // 4. Send it off to your original display function!
    displayWeatherInfo(simulatedData)
}

async function loadDefaultCity(defaultCity) {
    try {
        // Reuses the exact search pipeline you already built!
        const weatherData = await getWeatherData(defaultCity);
        displayWeatherInfo(weatherData);
    } catch (error) {
        displayError(`Could not load default city weather: ${error.message}`);
    }
}