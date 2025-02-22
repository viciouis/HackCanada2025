# Build the React app
FROM node:18 AS build

WORKDIR /app

# Set environment variable to use legacy OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy package.json and package-lock.json
COPY package*.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . . 

# Run build
RUN npm run build

# Serve static files using Nginx
FROM nginx:alpine

# Copy the build output to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
