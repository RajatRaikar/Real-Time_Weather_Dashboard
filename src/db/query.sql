CREATE DATABASE IF NOT EXISTS weather_dashboard;
//
USE weather_dashboard;
//
CREATE TABLE IF NOT EXISTS weather (
    id INT PRIMARY KEY AUTO_INCREMENT,
    location VARCHAR(100) UNIQUE,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    timestamp TIMESTAMP
);
//
CREATE TABLE IF NOT EXISTS user_preference (
    id INT PRIMARY KEY AUTO_INCREMENT,
    socket_id  VARCHAR(100) NULL,
    user_preference INT,
    FOREIGN KEY (user_preference) REFERENCES weather(id)
);
//
CREATE PROCEDURE IF NOT EXISTS InsertWeatherData(
    IN location VARCHAR(100),
    IN temperature FLOAT,
    IN humidity FLOAT,
    IN timestamp TIMESTAMP
)
BEGIN
    INSERT INTO weather (location, temperature, humidity, timestamp)
    VALUES (location, temperature, humidity, timestamp);
END;
//
CREATE PROCEDURE IF NOT EXISTS InsertUserPreference(
    IN user_preference INT
)
BEGIN
    INSERT INTO user_preference (user_preference)
    VALUES (user_preference);
END;
//
CREATE PROCEDURE IF NOT EXISTS InsertUserPreference(
    IN user_preference INT
)
BEGIN
    INSERT INTO user_preference(user_preference)
    VALUES (user_preference);
END;
//
CREATE PROCEDURE IF NOT EXISTS UpdateWeatherData(
    IN location VARCHAR(100),
    IN temperature FLOAT,
    IN humidity FLOAT,
    IN timestamp TIMESTAMP
)
BEGIN
    UPDATE weather
    SET temperature = temperature,
        humidity = humidity,
        timestamp = timestamp
    WHERE location = location;
END;
//
CREATE PROCEDURE IF NOT EXISTS UpdateUserPreference(
    IN id INT,
    IN user_preference INT
)
BEGIN
    UPDATE user_preference
    SET user_preference = user_preference
    WHERE id = id;
END;
//
CREATE PROCEDURE IF NOT EXISTS GetWeatherDataByLocation(
    IN get_location VARCHAR(100)
)
BEGIN
    SELECT id, temperature, humidity, timestamp, location
    FROM weather
    WHERE location = get_location;
END;
//
CREATE PROCEDURE IF NOT EXISTS GetUserPreference(
    IN id INT
)
BEGIN
    SELECT * FROM user_preference
    WHERE id = id;
END;
//
-- CREATE PROCEDURE IF NOT EXISTS GetAllWeatherData()
-- BEGIN
--     SELECT *
--     FROM weather
--     WHERE id > 0;
-- END;
//
CREATE VIEW IF NOT EXISTS WeatherDataByLocation AS
SELECT id, location, temperature, humidity, timestamp FROM weather;
//
CREATE PROCEDURE IF NOT EXISTS GetAllWeatherData()
BEGIN
    SELECT *
    FROM WeatherDataByLocation;
END;