"use strict";

const PROXY_BASE_URL = 'https://weather-report-proxy-server-r3ag.onrender.com';

const state = {
temp: 70,
city: 'Seattle',
sky: 'sunny',
unit: 'F'
}

const SKY_OPTIONS = {
sunny: { emojis: '☁️ ☁️ ☁️ ☀️ ☁️ ☁️', className: 'sunny' },
cloudy: { emojis: '☁️☁️ ☁️ ☁️ ☁️ 🌤 ☁️ ', className: 'cloudy' },
rainy: { emojis: '🌧🌈⛈🌧💧⛈🌧🌦💧', className: 'rainy' },
snowy: { emojis: '🌨❄️🌨❄️❄️🌨🌨❄️❄️', className: 'snowy' },
};

const WEATHER_TO_SKY = {
Clear: 'sunny',
Clouds: 'cloudy',
Rain: 'rainy',
Drizzle: 'rainy',
Thunderstorm: 'rainy',
Snow: 'snowy',
};

const dom = {
tempValue: document.getElementById('tempValue'),
increaseTempBtn: document.getElementById('increaseTempControl'),
decreaseTempBtn: document.getElementById('decreaseTempControl'),
landscape: document.getElementById('landscape'),
headerCityName: document.getElementById('headerCityName'),
cityNameInput: document.getElementById('cityNameInput'),
currentTempButton: document.getElementById('currentTempButton'),
skySelect: document.getElementById('skySelect'),
gardenContent: document.getElementById('gardenContent'),
sky: document.getElementById('sky'),
cityNameReset: document.getElementById('cityNameReset'),
unitToggleBtn: document.getElementById('unitToggleBtn')

};

const updateTempUI = () => {
const displayTemp =
state.unit === 'C'
? Math.round(((state.temp - 32) * 5) / 9)
: Math.round(state.temp);
dom.tempValue.textContent = displayTemp;
dom.unitToggleBtn.querySelectorAll('.unit-option').forEach((span) => {
span.classList.toggle('active', span.dataset.unit === state.unit);
});
updateTempColor();
updateLandScape();
};

const updateTempColor = () => {
if (state.temp >= 80) {
dom.tempValue.className = 'red'
}
else if (state.temp >= 70) {
dom.tempValue.className = 'orange'
}
else if (state.temp >= 60) {
dom.tempValue.className = 'yellow'
}
else if (state.temp >= 50) {
dom.tempValue.className = 'green'
}
else if (state.temp <= 49) {
dom.tempValue.className = 'teal'
}
}

const updateLandScape = () => {
if (state.temp >= 80) {
dom.landscape.textContent = '🌵__🐍_🦂_🌵🌵__🐍_'
}
else if (state.temp >= 70) {
dom.landscape.textContent = '🌸🌿🌼__🌷🌻🌿_☘️🌱_'
}
else if (state.temp >= 60) {
dom.landscape.textContent = '🌾🌾_🍃_🪨__🛤_🌾🌾'
}
else if (state.temp <= 59) {
dom.landscape.textContent = '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲'
}
}

const decreaseTemp = () => {
const step = state.unit === 'C' ? 1.8 : 1;
state.temp -= step
updateTempUI()
}

dom.decreaseTempBtn.addEventListener('click', decreaseTemp);

const increaseTemp = () => {
const step = state.unit === 'C' ? 1.8 : 1;
state.temp += step
updateTempUI()
}

dom.increaseTempBtn.addEventListener('click', increaseTemp);

const updateCityName = (e) => {
state.city = e.target.value;
dom.headerCityName.textContent = state.city;
}

dom.cityNameInput.addEventListener('input', updateCityName)

const updateOnEnter = (e) => {
if (e.key === 'Enter') {
getLatLon()
}
}
dom.cityNameInput.addEventListener('keydown', updateOnEnter)

const getLatLon = () => {
axios
.get(`${PROXY_BASE_URL}/location`, {
params: {
q : state.city

}})
.then((response) => {
const lat = response.data[0].lat;
const lon = response.data[0].lon;
getWeather(lat, lon)
})

.catch((error) => { console.log(error); })
}

const getWeather = (lat, lon) => {
axios
.get(`${PROXY_BASE_URL}/weather`, {
params: {
lat, lon

}})
.then((response) => {
const kelvin = response.data.main.temp;
const ktof = Math.round((kelvin - 273.15) * (9 / 5) + 32);
state.temp = ktof;
const condition = response.data.weather[0].main;
state.sky = WEATHER_TO_SKY[condition] || 'cloudy';
updateTempUI()
updateSkyUI();

})
.catch((error) => { console.log(error); })
}

dom.currentTempButton.addEventListener('click', getLatLon);

const updateSkyUI = () => {
dom.sky.textContent = SKY_OPTIONS[state.sky].emojis;
dom.gardenContent.className = `hero-stage ${SKY_OPTIONS[state.sky].className}`;
dom.skySelect.value = state.sky;
};

const handleSkyChange = (e) => {
state.sky = e.target.value;
updateSkyUI();
};

dom.skySelect.addEventListener('change', handleSkyChange);

const resetCityName = () => {
state.city = 'Seattle';
dom.headerCityName.textContent = state.city;
dom.cityNameInput.value = state.city;
getLatLon();
}

dom.cityNameReset.addEventListener('click', resetCityName);

const toggleUnit = () => {
state.unit = state.unit === 'F' ? 'C' : 'F';
updateTempUI();
};

dom.unitToggleBtn.addEventListener('click', toggleUnit);

getLatLon();