import * as api from "./fetch-api";
import * as mock from "./fetch-mock";

let fetch;
if (parseInt(process.env.REACT_APP_MOCK_API, 10)) {
  console.log(
    "Using mock API."
  );
  fetch = mock;
} else {
  fetch = api;
}

export const fetchCurrentWeather = fetch.fetchCurrentWeather;
export const fetchForecast = fetch.fetchForecast;
