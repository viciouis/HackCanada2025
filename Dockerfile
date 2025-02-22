# Use multi-stage builds to keep the final image small

# Step 1: Build the frontend
FROM node:18 AS frontend
WORKDIR /app
COPY frontend/ ./
RUN npm install && npm run build

# Step 2: Build the backend
FROM python:3.10 AS backend
WORKDIR /app
COPY backend/ ./
RUN pip install -r requirements.txt

# Step 3: Create the final container
FROM nginx:alpine
WORKDIR /app

# Copy built frontend from the first stage
COPY --from=frontend /app/build /usr/share/nginx/html

# Copy backend from the second stage
COPY --from=backend /app /backend

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose necessary ports
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
