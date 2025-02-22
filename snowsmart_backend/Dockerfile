# Use official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies (including axios)
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the backend port (e.g., 5000)
EXPOSE 5000

# Command to run the backend server
CMD ["node", "app.js"]
