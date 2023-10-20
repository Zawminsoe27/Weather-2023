let selector = (ele) => document.querySelector(ele);
let allSelector = (ele) => document.querySelectorAll(ele);

const cityinput = selector(".city-input");
const API_KEY = "40a8407233150c80b8391dc6c2a53a7c";
const searchButton = selector(".search-btn");
const weatherCardsDiv = selector(".weather-cards");

const createWeatherCard = (weatherItem) => {
	const formatTemp = (weatherItem.main.temp - 273.15).toFixed(2)
	return `	<li class="card">
					<h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
					<img src="https://openweathermap.org/img/wn/${
						weatherItem.weather[0].icon
					}@2x.png" alt="">
					<h4>Temp:${formatTemp}℃</h4>
					<h4>Wind:${weatherItem.wind.speed}  M/S</h4>
					<h4>Humidity: ${weatherItem.main.humidity}%</h4>
				</li>`;
};
const getWeatherDetails = (city, lat, lon) => {
	const Weather_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&&appid=${API_KEY}`;
	fetch(Weather_API_URL)
		.then((res) => res.json())
		.then((data) => {
			// Filter the forecasts to get only one forecast per day
			const uniqueForecastDays = [];

			console.log(data);
			const fiveDatsForecast = data.list.filter((forecast) => {
				const forecastDate = new Date(forecast.dt_txt).getDate();
				if (!uniqueForecastDays.includes(forecastDate)) {
				}
				return uniqueForecastDays.push(forecastDate);
			});
			console.log(fiveDatsForecast);
			fiveDatsForecast.forEach((weatherItem) => {
				weatherCardsDiv.insertAdjacentHTML(
					"beforeend",
					createWeatherCard(weatherItem)
				);
				createWeatherCard(weatherItem);
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

const getCityCoordinate = () => {
	const cityName = cityinput.value.trim();
	if (!cityName) {
		return;
	}
	const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}
	`;
	fetch(GEOCODING_API_URL)
		.then((res) => res.json())
		.then((data) => {
			if (!data.length)
				return console.warn(
					`Error occur we are not found ${cityName} please enter a valid name`
				);
			const { name, lat, lon } = data[0];
			getWeatherDetails(name, lat, lon);
			// console.log(data);
		})
		.catch((err) => {
			console.log(err);
		});
};

searchButton.addEventListener("click", getCityCoordinate);
