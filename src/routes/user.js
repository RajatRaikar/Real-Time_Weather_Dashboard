const express = require("express");
const userRouter = express.Router();
const error = require("../error/error");
const weatherAPI = require("../api/weatherApi");
const { getDataByLoc, getUserPreferenceById, insertUserPreference, updateUserPreference, insertWeatherData, updateWeatherData, getWeatherDataByUserPreference, getUserPreferenceByLocationById } = require("../db/dbHelper");

userRouter.post("/", async (req, res) => {
  try {
    // GET DATA FROM BODY
    const userPreferenceLoc = req.body.preference;
    const userId = req.body.id;

    if (!userPreferenceLoc || userPreferenceLoc.trim() === "") return res.status(400).json({ msg: error.INVALID_PREFERENCE });
    if (!userId || userId <= 0 || isNaN(parseInt(userId))) return res.status(400).json({ msg: error.INVALID_ID });

    let [userData] = await getUserPreferenceById(parseInt(userId));
    if (!userData.length) return res.status(400).json({ msg: error.INVALID_ID });

    let [dbResult] = await getDataByLoc(userPreferenceLoc);
    if (!dbResult.length) {
      const result = await weatherAPI([userPreferenceLoc]);
      if (result === error.WEATHER_API_ERROR)
        return res.status(500).json({
          msg: result,
        });
      const timestamp = result[0].timestamp.replace("T", " ").replace("Z", "");
      await insertWeatherData(result[0].location, result[0].temperature, result[0].humidity, timestamp);
    } else {
      const result = await weatherAPI([userPreferenceLoc]);
      if (result === error.WEATHER_API_ERROR)
        return res.status(500).json({
          msg: result,
        });
      const timestamp = result[0].timestamp.replace("T", " ").replace("Z", "");
      await updateWeatherData(result[0].location, result[0].temperature, result[0].humidity, timestamp);
    }
    [dbResult] = await getDataByLoc(userPreferenceLoc);

    await updateUserPreference(userData[0].id, dbResult[0].id);
    return res.status(200).json({ user_id: userData[0].id, loc_id: dbResult[0].id, temperature: dbResult[0].temperature, humidity: dbResult[0].humidity, timestamp: dbResult[0].timestamp, location: dbResult[0].location });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: error.SOMETHING_WENT_WRONG,
    });
  }
});

userRouter.get("/", async (req, res) => {
  try {
    const [userData] = await getWeatherDataByUserPreference();
    return res.status(200).json(userData);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: error.SOMETHING_WENT_WRONG,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const userNativeId = req.body.native_id;
    if (!userNativeId || userNativeId.trim() === "") return res.status(400).json({ msg: error.INVALID_NATIVE_ID });
    let [userData] = await getUserPreferenceByLocationById(userNativeId.trim());
    if (userData.length) return res.status(200).json(userData[0]);
    await insertUserPreference(userNativeId.trim(), 0);
    [userData] = await getUserPreferenceByLocationById(userNativeId.trim());
    return res.status(200).json(userData[0]);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: error.SOMETHING_WENT_WRONG,
    });
  }
});

module.exports = userRouter;
