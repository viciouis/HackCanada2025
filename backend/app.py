from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # This will allow requests from all origins

# Weather endpoint
@app.route('/weather')
def weather():
    city = request.args.get('city')  # Get city from query params
    return jsonify({"city": city, "temperature": "15°C"})

# Snow tips endpoint
@app.route('/snow-tips')
def snow_tips():
    return jsonify({"tip": "Use salt to prevent ice buildup!"})

# Run the server
if __name__ == '__main__':
    app.run(port=5000)
