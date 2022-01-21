// Import Open Weather Map api key from api-config.json
import config from "./api-config.json";
const API_KEY = config.key;
console.log(API_KEY);


const idLookup = {
  Helsinki: 658225,
  Jyväskylä: 655195,
  Kuopio: 650225,
  Tampere: 634964,
};

// Simple container class for holding the current weather information.
class CurrentData {
  constructor(
    city,
    icon,
    temperature,
    description,
    wind_speed,
    date,
    humidity,
    time,
    precipitation = "" //empty if info not available
  ) {
    this.city = city;
    this.icon = icon;
    this.temperature = temperature;
    this.description = description;
    this.wind_speed = wind_speed;
    this.date = date;
    this.humidity = humidity;
    this.time = time;
    this.precipitation = precipitation;
  }
}

// Simple container class for holding a single weather forecast i.e. a weather
// some time in the future.
class ForecastData {
  constructor(
    icon,
    temperature,
    wind_speed,
    humidity,
    time,
    precipitation = "" //empty if info not available
  ) {
    this.icon = icon;
    this.temperature = temperature;
    this.wind_speed = wind_speed;
    this.humidity = humidity;
    this.time = time;
    this.precipitation = precipitation;
  }
}

// Given the name of a city as a string perform a OWM request for this city and
// return an currentData object that contains the weather data for the current
// time.
//async
async function fetchCurrentWeather(city) {
  const id = idLookup[city];
  const requestString = `https://api.openweathermap.org/data/2.5/weather?id=${id}&lang=fi&appid=${API_KEY}`;
  const request = new Request(requestString);

  try {
    const _response = await fetch(request);
    const response = await _response.json();

    const dt = new Date(response.dt * 1000);
    const _time = `${("0" + dt.getHours()).slice(-2)}:${(
      "0" + dt.getMinutes()
    ).slice(-2)}`;
    const _date = dt.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "long",
    });

    return new CurrentData(
      city,
      response.weather[0].icon,
      response.main.temp - 273.15, // transform to celsius
      response.weather[0].description,
      response.wind.speed,
      _date,
      response.main.humidity,
      _time,
      typeof response.precipitation === "undefined"
        ? "--"
        : response.precipitation //empty if info not available
    );
  } catch (error) {
    console.error(error);
  }
}

// Given the name of a city as a string perform a OWM request and return an
//forecastData object that contains 5 data for the following hours wrt current
//time with 3 hour intervals (such that a request made at 11.53 should then
//contain data for 15.00, 18.00, 21.00, 00.00 and 03.00).
//async function fetchForecast(city) {
async function fetchForecast(city) {
  const id = idLookup[city];
  const requestString = `https://api.openweathermap.org/data/2.5/forecast?id=${id}&cnt=6&lang=fi&appid=${API_KEY}`;
  const request = new Request(requestString);
  try {
    const _response = await fetch(request);
    const response = await _response.json();

    const tail = (arr) => (arr.length > 1 ? arr.slice(1) : arr);
    const forecast = tail(response.list).map((data) => {
      let dt = new Date(data.dt * 1000);
      const _time = `${("0" + dt.getHours()).slice(-2)}:${(
        "0" + dt.getMinutes()
      ).slice(-2)}`;
      return new ForecastData(
        data.weather[0].icon,
        data.main.temp - 273.15, // transform to celsius
        data.wind.speed,
        data.main.humidity,
        _time,
        typeof response.precipitation === "undefined"
          ? "--"
          : data.precipitation //empty if info not available
      );
    });
    return forecast;
  } catch (error) {
    console.error(error);
  }
}

export { fetchCurrentWeather, fetchForecast };
