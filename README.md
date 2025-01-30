# GraphQL Weather API

This project is a **GraphQL API** that retrieves weather data from the OpenWeatherMap API. It provides an intuitive and flexible way to query weather information such as temperature, humidity, wind speed, and more.

## Features

- Query weather data by city name.
- Fetch detailed weather information, including temperature, pressure, humidity, and more.
- Custom landing page and about page for documentation and API guidance.
- Built using `Apollo Server Express` for GraphQL and `Express` for serving static files.
- Dockerized for easy deployment.

---

## Project Structure

```plaintext
graphql-weather-api/
├── server.js          # Main server file
├── schema/
│   ├── weather.js     # GraphQL schema and resolvers for weather queries
├── pages/
│   ├── layout.html    # Shared layout for navbar and footer
│   ├── landing.html   # Landing page content
│   ├── about.html     # About page content
├── css/
│   ├── styles.css     # Centralized styles for the project
├── config.js          # Configuration file (API keys and base URL)
├── package.json       # Project dependencies
├── docker-compose.yml # Docker Compose configuration
├── Dockerfile         # Dockerfile for containerized deployment
└── node_modules/      # Installed dependencies
```

## Requirements

- Node.js v14+ installed.
- OpenWeatherMap API key.
- Docker installed (optional for containerized deployment).

## Installation

1. Clone this repository:

```bash
git clone https://github.com/your-username/graphql-weather-api.git
cd graphql-weather-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```env
OPENWEATHER_API_KEY=your-api-key-here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5/weather
```

## Usage

### Start the Server

Run the following command to start the server:

```bash
node server.js
```

- The server will be available at [http://localhost:4000](http://localhost:4000).

## Running with Docker

To run the GraphQL Weather API from Docker Hub:

```bash
docker pull thegoodbyegirl/graphql-weather-api:latest
docker run -p 4000:4000 --env-file .env thegoodbyegirl/graphql-weather-api
```

To build and run the image locally:

```bash
docker build -t graphql-weather-api .
docker run -p 4000:4000 --env-file .env graphql-weather-api
```

### Running with Docker Compose

If you want to manage the API using Docker Compose, create a `docker-compose.yml` file and add:

```yaml
version: '3.8'
services:
  graphql-api:
    build: .
    image: graphql-weather-api
    container_name: graphql-weather-api
    ports:
      - "4000:4000"
    env_file:
      - .env
    environment:
      - NODE_ENV=development
    restart: always
```

Run:

```bash
docker-compose up -d --build
```

Now visit `http://localhost:4000/graphql` to access the API.

---

## Fixing Apollo Sandbox Disappearance in Docker

When running in a **Docker container**, Apollo Server may detect **production mode**, disabling the sandbox button by default. To re-enable it, update `server.js`:

```javascript
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema/weather');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection (needed for Apollo Sandbox)
  playground: true,    // Ensure Apollo's built-in Playground works
  csrfPrevention: false, // Prevent issues with Apollo security defaults
});

server.listen().then(({ url }) => {
  console.log(`🚀 GraphQL API ready at ${url}graphql`);
  console.log(`🌐 Landing page ready at ${url}`);
});
```

Restart the server:

```bash
node server.js
```

Now the **Apollo Sandbox button should reappear** at `http://localhost:4000/`.

---

## Available Endpoints

- **GraphQL Endpoint:**  [http://localhost:4000/graphql](http://localhost:4000/graphql)
- **Landing Page:**  [http://localhost:4000/](http://localhost:4000/)
- **About Page:**  [http://localhost:4000/about](http://localhost:4000/about)

## GraphQL API

### Query Example

To fetch weather data for a specific city, use the following query in a GraphQL client (e.g. Apollo Sandbox, GraphQL Playground, Postman):

```graphql
query {
    getWeather(city: "London") {
        city
        temperature
        feelsLike
        tempMin
        tempMax
        pressure
        humidity
        description
        windSpeed
        windDegree
        rainVolume
        cloudCoverage
        sunrise
        sunset
        country
    }
}
```

## Query Response Example

```json
{
"data": {
    "getWeather": {
    "city": "London",
    "temperature": 9.25,
    "feelsLike": 6.07,
    "tempMin": 8.64,
    "tempMax": 10.27,
    "pressure": 981,
    "humidity": 87,
    "description": "broken clouds",
    "windSpeed": 7.72,
    "windDegree": 220,
    "rainVolume": 0,
    "cloudCoverage": 75,
    "sunrise": 1738050276,
    "sunset": 1738082527,
    "country": "GB"
    }
}
}
```

---

## Future Enhancements

- Add more query options (e.g., weather by coordinates or ZIP code).
- Support for real-time updates with GraphQL subscriptions.
- Add caching for weather data to reduce API calls.
- Implement unit tests for schema and resolvers.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [OpenWeatherMap API](https://openweathermap.org/api)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Express](https://expressjs.com/)

