const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const toggleThemeButton = document.getElementById('toggle-theme');
const cityInput = document.getElementById('city-input');
const suggestions = document.getElementById('suggestions');

// List of sample city names for suggestions
const citySuggestions = ['New York', 'London', 'Paris', 'Tokyo', 'Mumbai', 'Delhi', 'Sydney', 'Berlin', 'Toronto'];

// Toggle theme between dark and light
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    container.classList.toggle('light-mode');
    container.classList.toggle('dark-mode');
});

cityInput.addEventListener('input', () => {
    const value = cityInput.value.toLowerCase();
    suggestions.innerHTML = '';

    // Filter cities based on input and display them
    const filteredCities = citySuggestions.filter(city =>
        city.toLowerCase().startsWith(value)
    );

    if (filteredCities.length > 0) {
        suggestions.style.display = 'block';
        filteredCities.forEach(city => {
            const div = document.createElement('div');
            div.textContent = city;
            div.addEventListener('click', () => {
                cityInput.value = city;
                suggestions.style.display = 'none';
            });
            suggestions.appendChild(div);
        });
    } else {
        suggestions.style.display = 'none';
    }
});

search.addEventListener('click', () => {
    const APIKey = 'f3c68b8c1f7ecdd760af201d8f172494';
    const city = cityInput.value;

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        });
});

document.addEventListener('click', (e) => {
    if (e.target !== cityInput) {
        suggestions.style.display = 'none';
    }
});
