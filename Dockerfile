# Use the official Node.js 14 LTS image as the base image
FROM node:21.2.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code into the container
COPY . .

# Expose the application's port
EXPOSE 3000

# Start the Node.js application
CMD [ "node", "app.js" ]
