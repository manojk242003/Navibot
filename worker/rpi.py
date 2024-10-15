from flask import Flask, request, jsonify
import json

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

let IamBusy = false


class Location:
    def __init__(self, lat, lon):
        self.lat = lat
        self.lon = lon

    def __repr__(self):
        return f"({self.lat}, {self.lon})"

def travel(src, dest):
    start_lat = src.lat
    start_lon = src.lon
    end_lat = dest.lat
    end_lon = dest.lon

    print(f"Traveling from {src} to {dest}")
    return {
        "start": {"lat": start_lat, "lon": start_lon},
        "end": {"lat": end_lat, "lon": end_lon},
        "message": f"Traveling from {src} to {dest}"
    }

@app.route('/status', methods=['GET'])
def isBotBusy():
    return jsonify({result: IamBusy})

@app.route('/travel', methods=['POST'])
def travel_route():
    print("Received request data:", request.data)
    print("Received request json:", request.json)
    
    try:
        data = json.loads(request.data)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON'}), 400
    
    print("Parsed data:", data)
    
    src_data = data.get('src')
    dest_data = data.get('dest')
    
    print("Source data:", src_data)
    print("Destination data:", dest_data)

    if not src_data or not dest_data:
        return jsonify({'error': 'Source and destination data are required'}), 400

    src = Location(src_data['lat'], src_data['lon'])
    dest = Location(dest_data['lat'], dest_data['lon'])

    result = travel(src, dest)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=3001)