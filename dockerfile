# Use an official node runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
