require('dotenv').config(); // Explicit path (only if necessary)

const config = {
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  OPENWEATHER_BASE_URL: process.env.OPENWEATHER_BASE_URL,
};

module.exports = config;
