#!/bin/sh
# Start Nginx
nginx -g 'daemon off;' &

# Print out the link to frontend after Nginx is up
echo "Frontend server running on http://localhost"

# Keep the container alive
tail -f /dev/null
