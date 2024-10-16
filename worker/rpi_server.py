import RPi.GPIO as GPIO
import smbus
import serial
import time
import math
import pynmea2
from flask import Flask, request, jsonify
from math import radians, sin, cos, sqrt, atan2, pi
from picamzero import Camera
import threading

app = Flask(__name__)

# Suppress GPIO warnings
GPIO.setwarnings(False)

# Motor, Encoder, and Sensor Setup
MOTOR_LF = 5  # Left motor forward
MOTOR_LB = 6  # Left motor backward
MOTOR_RF = 13  # Right motor forward
MOTOR_RB = 19  # Right motor backward
TRIG_PIN = 16  # Ultrasonic sensor trigger
ECHO_PIN = 18  # Ultrasonic sensor echo
SERVO_PIN = 17  # Servo pin for obstacle scanning

GPIO.setmode(GPIO.BCM)  # Set the GPIO mode to BCM
GPIO.setup([MOTOR_LF, MOTOR_LB, MOTOR_RF, MOTOR_RB], GPIO.OUT)  # Motor pins setup
GPIO.setup(TRIG_PIN, GPIO.OUT)  # Ultrasonic trigger
GPIO.setup(ECHO_PIN, GPIO.IN)  # Ultrasonic echo

# Servo motor PWM setup
GPIO.setup(SERVO_PIN, GPIO.OUT)
servo = GPIO.PWM(SERVO_PIN, 50)  # 50 Hz for the servo
servo.start(0)

# PID Variables
Kp = 1.0
Ki = 0.01
Kd = 0.5
last_error = 0
integral = 0

# GPS Setup (Neo-6M GPS module)
try:
    gps_serial = serial.Serial(
        port="/dev/ttyS0",  # The GPS module is typically on ttyS0 or ttyAMA0 on Raspberry Pi
        baudrate=9600,
        timeout=1  # Timeout for serial reading
    )
    print("GPS serial port opened successfully: /dev/ttyS0")
except Exception as e:
    print(f"Error opening GPS serial port: {e}")

# MPU6050 Setup
try:
    bus = smbus.SMBus(1)  # or 0 depending on Raspberry Pi version
    MPU6050_ADDR = 0x68
    GYRO_XOUT_H = 0x43
    bus.write_byte_data(MPU6050_ADDR, 0x6B, 0)  # Wake up MPU6050
    print("I2C bus initialized successfully")
except Exception as e:
    print(f"Error initializing I2C bus: {e}")

# GPS Functions (Neo-6M using pynmea2)
def parse_nmea_sentence(sentence):
    gps_data = {
        'latitude': None,
        'longitude': None,
        'altitude': None,
        'speed': None,
        'datetime': None,
        'fix_quality': None,
        'num_satellites': None
    }

    try:
        msg = pynmea2.parse(sentence)
        print(f"Parsed message: {msg}")

        if isinstance(msg, pynmea2.types.talker.GGA):
            gps_data['latitude'] = msg.latitude
            gps_data['longitude'] = msg.longitude
            gps_data['altitude'] = msg.altitude
            gps_data['fix_quality'] = msg.gps_qual
            gps_data['num_satellites'] = msg.num_sats
            print(f"GGA: Lat: {msg.latitude}, Lon: {msg.longitude}, Altitude: {msg.altitude}, Fix quality: {msg.gps_qual}, Satellites: {msg.num_sats}")

        elif isinstance(msg, pynmea2.types.talker.RMC):
            gps_data['latitude'] = msg.latitude
            gps_data['longitude'] = msg.longitude
            gps_data['datetime'] = msg.datetime
            gps_data['speed'] = msg.spd_over_grnd
            print(f"RMC: Date/Time: {msg.datetime}, Lat: {msg.latitude}, Lon: {msg.longitude}, Speed: {msg.spd_over_grnd}")

        elif isinstance(msg, pynmea2.types.talker.GLL):
            gps_data['latitude'] = msg.latitude
            gps_data['longitude'] = msg.longitude
            print(f"GLL: Lat: {msg.latitude}, Lon: {msg.longitude}")

    except pynmea2.ParseError as e:
        print(f"Error parsing NMEA sentence: {e}")

    return gps_data

def read_gps():
    try:
        sentence = gps_serial.readline().decode('ascii', errors='replace').strip()
        if sentence:
            return parse_nmea_sentence(sentence)
        return None
    except Exception as e:
        print(f"Error reading GPS: {e}")
        return None

# MPU6050 Functions
def get_gyro_heading(prev_heading, dt):
    try:
        gyro_z_raw = bus.read_byte_data(MPU6050_ADDR, GYRO_XOUT_H)
        gyro_z = (gyro_z_raw - 128) / 131.0  # Convert raw data
        heading_change = gyro_z * dt
        new_heading = (prev_heading + heading_change) % 360
        return new_heading
    except Exception as e:
        print(f"Error reading MPU6050: {e}")
        return prev_heading

# Ultrasonic Sensor
def get_distance():
    GPIO.output(TRIG_PIN, GPIO.LOW)
    time.sleep(0.05)
    GPIO.output(TRIG_PIN, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIG_PIN, GPIO.LOW)

    while GPIO.input(ECHO_PIN) == 0:
        pulse_start = time.time()

    while GPIO.input(ECHO_PIN) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150  # Speed of sound is 34300 cm/s
    return round(distance, 2)

# Motor Control Functions
def set_motor_speed(left_speed, right_speed):
    if left_speed > 0:
        GPIO.output(MOTOR_LF, GPIO.HIGH)
        GPIO.output(MOTOR_LB, GPIO.LOW)
    elif left_speed < 0:
        GPIO.output(MOTOR_LF, GPIO.LOW)
        GPIO.output(MOTOR_LB, GPIO.HIGH)
    else:
        GPIO.output(MOTOR_LF, GPIO.LOW)
        GPIO.output(MOTOR_LB, GPIO.LOW)

    if right_speed > 0:
        GPIO.output(MOTOR_RF, GPIO.HIGH)
        GPIO.output(MOTOR_RB, GPIO.LOW)
    elif right_speed < 0:
        GPIO.output(MOTOR_RF, GPIO.LOW)
        GPIO.output(MOTOR_RB, GPIO.HIGH)
    else:
        GPIO.output(MOTOR_RF, GPIO.LOW)
        GPIO.output(MOTOR_RB, GPIO.LOW)

# Stop motors
def stop_motors():
    GPIO.output(MOTOR_LF, GPIO.LOW)
    GPIO.output(MOTOR_LB, GPIO.LOW)
    GPIO.output(MOTOR_RF, GPIO.LOW)
    GPIO.output(MOTOR_RB, GPIO.LOW)

# PID Control for heading correction
def pid_control(target_angle, current_angle):
    global last_error, integral
    error = target_angle - current_angle
    integral += error
    derivative = error - last_error
    control = Kp * error + Ki * integral + Kd * derivative
    last_error = error
    return control

# GPS Navigation Functions
def calculate_gps_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth radius in meters
    phi1 = radians(lat1)
    phi2 = radians(lat2)
    delta_phi = radians(lat2 - lat1)
    delta_lambda = radians(lon2 - lon1)
    a = sin(delta_phi / 2) ** 2 + cos(phi1) * cos(phi2) * sin(delta_lambda / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

def calculate_bearing(lat1, lon1, lat2, lon2):
    phi1 = radians(lat1)
    phi2 = radians(lat2)
    delta_lambda = radians(lon2 - lon1)
    y = sin(delta_lambda) * cos(phi2)
    x = cos(phi1) * sin(phi2) - sin(phi1) * cos(phi2) * cos(delta_lambda)
    bearing = (atan2(y, x) * 180 / pi + 360) % 360
    return bearing

# Obstacle Avoidance
def avoid_obstacle():
    stop_motors()
    time.sleep(0.5)
    set_motor_speed(-1, -1)  # Reverse
    time.sleep(1)
    set_motor_speed(1, -1)  # Turn right
    time.sleep(0.5)
    stop_motors()

# Robot Navigation and Camera Functionality
def navigate_to_gps(src_lat, src_lon, dest_lat, dest_lon, take_photo=False):
    prev_heading = 0
    prev_time = time.time()

    while True:
        current_gps = read_gps()
        if current_gps is None or current_gps['latitude'] is None or current_gps['longitude'] is None:
            print("No valid GPS signal, waiting...")
            time.sleep(1)
            continue

        current_lat = current_gps['latitude']
        current_lon = current_gps['longitude']
        distance_to_destination = calculate_gps_distance(current_lat, current_lon, dest_lat, dest_lon)
        print(f"Distance to destination: {distance_to_destination:.2f} meters")

        if distance_to_destination < 5:  # Destination reached
            stop_motors()
            print("Destination reached!")
            if take_photo:
                take_photo_action()
            break

        bearing_to_destination = calculate_bearing(current_lat, current_lon, dest_lat, dest_lon)
        heading = get_gyro_heading(prev_heading, time.time() - prev_time)
        speed = pid_control(bearing_to_destination, heading)

        if get_distance() < 20:  # Obstacle detected
            avoid_obstacle()
            continue

        set_motor_speed(speed, speed)
        prev_heading = heading
        prev_time = time.time()

def take_photo_action():
    camera = Camera()
    camera.capture('/home/pi/Desktop/photo.jpg')
    print("Photo taken and saved.")

@app.route('/navigate', methods=['POST'])
def navigate():
    data = request.json
    src_lat = data.get('src_lat')
    src_lon = data.get('src_lon')
    dest_lat = data.get('dest_lat')
    dest_lon = data.get('dest_lon')
    take_photo = data.get('take_photo', False)

    if None in [src_lat, src_lon, dest_lat, dest_lon]:
        return jsonify({"error": "Missing source or destination coordinates"}), 400

    threading.Thread(target=navigate_to_gps, args=(src_lat, src_lon, dest_lat, dest_lon, take_photo)).start()
    return jsonify({"status": "Navigation started"}), 200

@app.route('/stop', methods=['POST'])
def stop():
    stop_motors()
    return jsonify({"status": "Navigation stopped"}), 200

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=3001)  # Run the Flask app
    except KeyboardInterrupt:
        stop_motors()
        GPIO.cleanup()
