# Use an official Node.js 14 image as a base
FROM node:20.18.0

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port that the app will use
EXPOSE 3000

# Run the command to start the app when the container launches
CMD ["npm", "start"]