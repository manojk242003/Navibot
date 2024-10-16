from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/navigate', methods=['POST'])
def navigate():
    data = request.json
    print(data)
    src_lat = data.get('src').lat
    src_lon = data.get('src').lon
    dest_lat = data.get('dest').lat
    dest_lon = data.get('dest').lon
    take_photo = data.get('take_photo', False)

    if None in [src_lat, src_lon, dest_lat, dest_lon]:
        return jsonify({"error": "Missing source or destination coordinates"}), 400



    return jsonify({"status": "Navigation started"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)  # Run the Flask app
