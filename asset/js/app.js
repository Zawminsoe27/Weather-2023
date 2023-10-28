
// searchButton.addEventListener("click", getCityCoordinate);
let selector = (ele) => document.querySelector(ele);
let allSelector = (ele) => document.querySelectorAll(ele);

const cityinput = selector(".city-input");
const API_KEY = "40a8407233150c80b8391dc6c2a53a7c";
const searchButton = selector(".search-btn");
const currentWeatherDiv = selector(".current-weather");
const weatherCardsDiv = selector(".weather-cards");
let locationButton = selector(".location-btn");

// Create weather card function with label for changes
const createWeatherCard = (cityName, weatherItem, index) => {
	const formatTemp = (weatherItem.main.temp - 273.15).toFixed(2);
	if (index === 0) {
		return `
		<div class="details">
			<div>
			<h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
			<h4>Temperature: ${formatTemp}℃</h4> <!-- Fixed typo here -->
			<h4>Wind: ${weatherItem.wind.speed} M/S</h4>
			<h4>Humidity: ${weatherItem.main.humidity}% </h4></div>
			<div class="icon">
			<img src="https://openweathermap.org/img/wn/${
				weatherItem.weather[0].icon
			}.png" /> <!-- Fixed weatherItem access here -->
			<h4>${weatherItem.weather[0].description}</h4>
		</div>
		</div>
		
		`;
	} else {
		return `<li class="card">
						<h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
						<img src="https://openweathermap.org/img/wn/${
							weatherItem.weather[0].icon
						}.png" alt=""> <!-- Fixed weatherItem access here -->
						<h4>Temp: ${formatTemp}℃</h4>
						<h4>Wind: ${weatherItem.wind.speed} M/S</h4>
						<h4>Humidity: ${weatherItem.main.humidity}%</h4>
					</li>`;
	}
};

// Get weather details with label for changes
const getWeatherDetails = (cityName, lat, lon) => {
	const Weather_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
	fetch(Weather_API_URL)
		.then((res) => res.json())
		.then((data) => {
			const uniqueForecastDays = [];
			cityinput.value = "";
			const fiveDaysForecast = data.list.filter((forecast) => {
				const forecastDate = new Date(forecast.dt_txt).getDate();
				if (!uniqueForecastDays.includes(forecastDate)) {
					return uniqueForecastDays.push(forecastDate);
				}
			});
			cityinput.value = "";
			weatherCardsDiv.innerHTML = "";
			currentWeatherDiv.innerHTML = "";

			fiveDaysForecast.forEach((weatherItem, index) => {
				if (index === 0) {
					weatherCardsDiv.insertAdjacentHTML(
						"beforeend",
						createWeatherCard(cityName, weatherItem, index)
					);
				} else {
					weatherCardsDiv.insertAdjacentHTML(
						"beforeend",
						createWeatherCard(cityName, weatherItem, index)
					);
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// Get city coordinates function with label for changes
const getCityCoordinate = () => {
	const cityName = cityinput.value.trim();
	if (!cityName) {
		return;
	}
	const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
	fetch(GEOCODING_API_URL)
		.then((res) => res.json())
		.then((data) => {
			if (!data.length)
				return console.warn(
					`Error occurred: City not found. Please enter a valid city name.`
				);
			const { name, lat, lon } = data[0];
			getWeatherDetails(name, lat, lon);
		})
		.catch((err) => {
			console.log(err);
		});
};
function getuserCordinates() {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			const { latitude, longitude } = position.coords;
			const REVERSE_GEOCODING_URL_ = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
			fetch(REVERSE_GEOCODING_URL_)
				.then((res) => res.json())
				.then((data) => {
					const { name } = data[0];
					getWeatherDetails(name, latitude, longitude);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		(error) => {
			if (error.code == error.PERMISSION_DENIED) {
				alert(error);
			}
		}
	);
}

searchButton.addEventListener("click", getCityCoordinate);
locationButton.addEventListener("click", getuserCordinates);
cityinput.addEventListener("keyup", (e) => {
	e.key === "Enter" && getCityCoordinate();
});
// 32:45
