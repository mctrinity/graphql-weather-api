# Use an official Node.js image
FROM node:18-alpine AS base

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies (include devDependencies in development mode)
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ]; then npm install --include=dev; else npm install --only=production; fi

# Copy everything
COPY . .

# Expose port
EXPOSE 4000

# Ensure node_modules/.bin is in PATH and run different commands for dev/prod
CMD ["sh", "-c", "export PATH=/usr/src/app/node_modules/.bin:$PATH && if [ \"$NODE_ENV\" = \"development\" ]; then npx nodemon server.js; else npm start; fi"]
