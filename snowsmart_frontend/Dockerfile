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

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Copy the entrypoint script into the container
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Make it executable
RUN chmod +x /docker-entrypoint.sh

# Set the entrypoint to the script
ENTRYPOINT ["/docker-entrypoint.sh"]
