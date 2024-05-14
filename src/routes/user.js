const express = require("express");
const userRouter = express.Router();
const error = require("../error/error");
const weatherAPI = require("../api/weatherApi");
const { getDataByLoc, getUserPreferenceById, insertUserPreference, updateUserPreference, insertWeatherData, updateWeatherData, getWeatherDataByUserPreference } = require("../db/dbHelper");

userRouter.post("/", async (req, res) => {
  try {
    // GET DATA FROM BODY
    const userPreferenceLoc = req.body.preference;
    const userId = req.body.id;

    if (!userPreferenceLoc || userPreferenceLoc.trim() === "") return res.status(400).json({ msg: error.INVALID_PREPERENCE });
    if (!userId || userId <= 0) return res.status(400).json({ msg: error.INVALID_ID });

    let [userData] = await getUserPreferenceById(userId);
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

    // CREATE
    if (!userData.length) {
      await insertUserPreference(dbResult[0].id);
      [userData] = await getUserPreferenceById(userId);
    } else {
      await updateUserPreference(userData[0].id, dbResult[0].id);
    }
    return res.status(200).json({ id: userData.id, dbResult });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: error.SOMETHING_WENT_WRONG,
    });
  }
});

userRouter.get("/", async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId || userId <= 0) return res.status(400).json({ msg: error.INVALID_ID });
    const userData = await getWeatherDataByUserPreference(userId);
    console.log(userData);
    if (!userData.length) return res.status(400).json({ msg: error.INVALID_ID });
    return res.status(200).json(userData[0]);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: error.SOMETHING_WENT_WRONG,
    });
  }
});

module.exports = userRouter;
