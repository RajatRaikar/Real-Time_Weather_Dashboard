const { connectWithRetry } = require("./database");


const insertUserPreference = async (userNativeId, locId) => {
  const connection = await connectWithRetry();
  return await new Promise((resolve, reject) => {
    connection.query("CALL InsertUserPreference(?,?)", [userNativeId, locId], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

const updateUserPreference = async (userId, locId) => {
  const connection = await connectWithRetry();
  return await new Promise((resolve, reject) => {
    connection.query("CALL UpdateUserPreference(?, ?)", [userId, locId], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

const insertWeatherData = async (location, temperature, humidity, timestamp) => {
  const connection = await connectWithRetry();
  return await new Promise((resolve, reject) => {
    connection.query("CALL InsertWeatherData(?,?,?,?)", [location, temperature, humidity, timestamp], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

const getDataByLoc = async (location) => {
  const connection = await connectWithRetry();
  return await new Promise((resolve, reject) => {
    connection.query("CALL GetWeatherDataByLocation(?)", [location], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

const getUserPreferenceById = async (id) => {
  const connection = await connectWithRetry();
  return await new Promise((resolve, reject) => {
    connection.query("CALL GetUserPreference(?)", [id], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

const getUserPreferenceByLocationById = async (userNativeId) => {
  const connection = await connectWithRetry();
  return await new Promise((resolve, reject) => {
    connection.query("CALL GetUserPreferenceByLocId(?)", [userNativeId], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

const getAllWeatherData = async () => {
  const connection = await connectWithRetry();
  return await new Promise((resolve, reject) => {
    connection.query("CALL GetAllWeatherData()", [], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

const updateWeatherData = async (location, temperature, humidity, timestamp) => {
  const connection = await connectWithRetry();
  return await new Promise((resolve, reject) => {
    connection.query("CALL UpdateWeatherData(?,?,?,?)", [location, temperature, humidity, timestamp], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

const getWeatherDataByUserPreference = async () => {
  const connection = await connectWithRetry();
  return await new Promise((resolve, reject) => {
    connection.query("CALL GetWeatherDataByUserPreference()", (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

module.exports = {
  getDataByLoc,
  getUserPreferenceById,
  insertUserPreference,
  updateUserPreference,
  insertWeatherData,
  getAllWeatherData,
  updateWeatherData,
  getWeatherDataByUserPreference,
  getUserPreferenceByLocationById
};
