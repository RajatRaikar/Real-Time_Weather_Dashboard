const axios = require("axios");
const error = require("../error/error");

const fetchWeatherData = async (locations) => {
  try {
    const weatherData = await Promise.all(
      locations.map(async (loc) => {
        const apiURL = `${process.env.API_URL}?q=${loc}&appid=${process.env.API_KEY}`;
        const response = await axios.get(apiURL);
        return {
          location: loc,
          temperature: response.data.main.temp,
          humidity: response.data.main.humidity,
          timestamp: new Date().toISOString(),
        };
      })
    );
    return weatherData;
  } catch (e) {
    return error.WEATHER_API_ERROR;
  }
};

module.exports = fetchWeatherData;
