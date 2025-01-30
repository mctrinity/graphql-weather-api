const { gql } = require('apollo-server-express');
const axios = require('axios');
const config = require('../config');

// Define the GraphQL schema
const typeDefs = gql`
  type Weather {
    city: String
    temperature: Float
    feelsLike: Float
    tempMin: Float
    tempMax: Float
    pressure: Int
    humidity: Int
    description: String
    windSpeed: Float
    windDegree: Int
    rainVolume: Float
    cloudCoverage: Int
    sunrise: Int
    sunset: Int
    country: String
  }

  type Query {
    getWeather(city: String!): Weather
  }
`;

// Define resolvers to fetch data from OpenWeatherMap
const resolvers = {
  Query: {
    getWeather: async (_, { city }) => {
      try {
        // Debug logs
        console.log(`Requesting weather for: ${city}`);
        console.log(`Using API key: ${config.OPENWEATHER_API_KEY}`);

        // Construct the API request URL
        const url = `${config.OPENWEATHER_BASE_URL}?q=${city}&appid=${config.OPENWEATHER_API_KEY}&units=metric`;
        console.log(`Constructed API URL: ${url}`);

        // Make the API request
        const response = await axios.get(url);

        // Log the full API response
        console.log('API Response:', response.data);

        // Extract the relevant data
        const data = response.data;
        return {
          city: data.name,
          temperature: data.main.temp,
          feelsLike: data.main.feels_like,
          tempMin: data.main.temp_min,
          tempMax: data.main.temp_max,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          windSpeed: data.wind.speed,
          windDegree: data.wind.deg,
          rainVolume: data.rain?.['1h'] || 0, // Handle missing rain data
          cloudCoverage: data.clouds.all,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          country: data.sys.country,
        };
      } catch (error) {
        // Enhanced error handling
        if (error.response) {
          console.error('Error Response Data:', error.response.data);
          console.error('Error Status Code:', error.response.status);
          if (error.response.status === 404) {
            throw new Error(`City "${city}" not found.`);
          }
        } else if (error.request) {
          console.error('No Response Received:', error.request);
        } else {
          console.error('Error Message:', error.message);
        }

        // Throw a user-friendly error
        throw new Error('Unable to fetch weather data. Please check the city name or API key.');
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
