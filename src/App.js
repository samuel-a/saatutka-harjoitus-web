import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import "react-dropdown/style.css";
import Dropdown from "react-dropdown";
import { fetchCurrentWeather, fetchForecast } from "./fetch";

// Context used solely for transferring knowledge of which cities are selected
// from dropdown to WeatherList
const selectionContext = React.createContext({
  selection: "Kaikki kaupungit",
  setSelection: (selected) => {},
});

// Cities to be picked from, first option is all cities because this structure
// is fed directly into the dropdown menu. Could be done otherwise.
const cities = [
  "Kaikki kaupungit",
  "Helsinki",
  "Jyväskylä",
  "Kuopio",
  "Tampere",
];

function App() {
  const [selection, setSelection] = useState(cities[0]);
  const value = { selection, setSelection };

  return (
    <div className="App">
      <div className="TopPadding" />
      <TopBar />
      <div
        style={{
          maxWidth: 400,
          margin: "auto",
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: 15,
          marginTop: 15,
        }}
      >
        <selectionContext.Provider value={value}>
          <DropDown />
          <ViewPicker />
        </selectionContext.Provider>
      </div>
    </div>
  );
}

const TopBar = () => {
  return (
    <div className="topBar">
      <p className="topBarText">Säätutka</p>
    </div>
  );
};

// Dropdown menu that communicates the user's selection back to other components
// within its Provider's context.
const DropDown = () => {
  const { setSelection } = useContext(selectionContext);
  const [selectedOption, setSelectedOption] = useState(cities[0]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption.value);
    setSelection(selectedOption.value);
  };

  return (
    <Dropdown value={selectedOption} options={cities} onChange={handleChange} />
  );
};

// Picks between showing results for all or just one city based on selection.
const ViewPicker = () => {
  const { selection } = useContext(selectionContext);

  if (selection === cities[0]) {
    return (
      <div>
        {cities.slice(1).map((city) => {
          return (
            <div key={city}>
              <CurrentWeatherView city={city} />
              <ForecastWeatherViewContainer city={city} />
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div>
        <CurrentWeatherView city={selection} />
        <ForecastWeatherViewContainer city={selection} />
      </div>
    );
  }
};

// Displays weather information for the current weather for the current city in
// the selection context.
const CurrentWeatherView = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const { selection } = useContext(selectionContext);

  useEffect(() => {
    const getData = async () => {
      const _data = await fetchCurrentWeather(props.city);
      setData(_data);
      setLoading(false);
      console.log("Got data: ", _data);
    };
    getData();
  }, [selection, props.city]); //Fetch on re-renders i.e. when the selection changes.

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="currentWeatherView">
      <div className="row">
        <div className="verticalAlignerStart">
          <p className="cityText">{data.city}</p>
          <p className="descriptionText">{data.description}</p>
        </div>
        <div className="row">
          <div>
            <img
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              style={{ width: 60, height: 60, marginTop: -10, marginRight: 5 }}
              alt="weather icon"
            />
          </div>
          <div>
            <p className="temperatureText">
              {data.temperature.toFixed(0) + "°C"}
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="verticalAlignerStart">
          <p />
          <p className="dateText">{data.date}</p>
          <p className="timeText">{data.time}</p>
        </div>
        <div className="verticalAlignerEnd">
          <p className="specificsText">
            {"Tuuli: " + data.wind_speed + " m/s"}
          </p>
          <p className="specificsText">
            {"Ilmankosteus: " + data.humidity + "%"}
          </p>
          <p className="specificsText">
            {"Sademäärä (3h): " + data.precipitation + "mm"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Holds several ForecastWeatherViews and delivers them their data through props.
const ForecastWeatherViewContainer = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const { selection } = useContext(selectionContext);

  useEffect(() => {
    const getData = async () => {
      const _data = await fetchForecast(props.city);
      setData(_data);
      setLoading(false);
    };
    getData();
  }, [selection, props.city]); //Fetch on re-renders i.e. when the selection changes.

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="forecastRow">
      {data.map( _data =>
        <ForecastWeatherView key={_data.time} data={_data} />
      )}
    </div>
  );
};

// Draws forecast weather information for a single forecast.
const ForecastWeatherView = (props) => {
  return (
    <div className="forecastWeatherViewContainer">
      <div className="forecastWeatherViewTop">
        <p className="timeText">{props.data.time}</p>
        <img
          src={`https://openweathermap.org/img/wn/${props.data.icon}@2x.png`}
          style={{ width: 40, height: 40 }}
          alt="weather icon"
        />
        <p className="smallTemperatureText">
          {props.data.temperature.toFixed(0) + "°C"}
        </p>
      </div>
      <div className="forecastWeatherViewBottom">
        <p className="smallSpecificsText">{props.data.wind_speed + " m/s"}</p>
        <p className="smallSpecificsText">{props.data.humidity + "%"}</p>
        <p className="smallSpecificsText">{props.data.precipitation + "mm"}</p>
      </div>
    </div>
  );
};

export default App;
