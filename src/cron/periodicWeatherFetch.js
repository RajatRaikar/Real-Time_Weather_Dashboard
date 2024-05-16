const { updateWeatherData, getWeatherDataByUserPreference } = require("../db/dbHelper");
const weatherAPI = require("../api/weatherApi");
const error = require("../error/error");
const { getIo } = require("../socket/io");

setInterval(async () => {
  try {
    const allWeatherData = await getWeatherDataByUserPreference();
    allWeatherData[0].map(async (entry) => {
      const result = await weatherAPI([entry.location]);
      if (result === error.WEATHER_API_ERROR) throw Error(error.WEATHER_API_ERROR);
      const timestamp = result[0].timestamp.replace("T", " ").replace("Z", "");
      await updateWeatherData(result[0].location, result[0].temperature, result[0].humidity, timestamp);
      const socket = getIo();

      socket.to(result[0].location).emit("message", {
        location: result[0].location,
        temperature: result[0].temperature,
        humidity: result[0].humidity,
        timestamp,
      });
    });
  } catch (e) {
    console.error("ERROR FROM CRON");
  }
}, process.env.PERIODIC_WEATHER_REFRESH_TIMER);
