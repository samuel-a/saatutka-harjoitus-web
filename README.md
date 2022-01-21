# Säätutka-harjoitus, web

Part of a recruitment process. A React app that uses OpenWeather's
Weather API to show weather information for select locations in Finland.

## How to run

Run `npm start` and navigate to [http://localhost:3000](http://localhost:3000) to view the project in your browser. API configuration is done by placing your OWM api key in `src/api-config.json`.

## Notes
* Created with create-react-app.
* OWM api will block you for some amount of time if you run too many requests
too fast so be mindful of this. Requests are only generated when you change your
selection in the dropdown.

## Screenshots
![A view showing all cities.](./screenshots/AllCities.jpg)
![A view showing the view for Tampere.](./screenshots/Tampere.jpg)
![A view showing the dropdown menu.](./screenshots/DropDown.jpg)