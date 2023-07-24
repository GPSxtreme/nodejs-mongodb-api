# Use the official Node.js image with Node version 18.x as the base image
# .env file is ignored so provide env variables during build of container.
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies (npm ci is preferred for production use)
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Compile TypeScript code to JavaScript (replace "build" with your actual build command if different)
RUN npm run build

# Expose the port that your Node.js application is listening on
EXPOSE 8000

# Command to run your application (replace "start" with your actual start command if different)
CMD ["npm", "start"]
