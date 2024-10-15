import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mariadb from 'mariadb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './middleware/authMiddleware.js';
import axios from "axios";

const app = express();
const port = 5000;
const JWT_SECRET = 'secret';
app.use(cors({ origin: '*' }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for profile image uploads
const profileImagesDir = path.join(__dirname, 'profile_images');
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImagesDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const uploadProfileImage = multer({ storage: profileStorage });

// Configure multer for order image uploads
const orderImagesDir = path.join(__dirname, 'order_images');
const orderStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, orderImagesDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const uploadOrderImage = multer({ storage: orderStorage });

// Navibot status to check if it's busy
let navibotStatus = true;

// MariaDB connection pool
const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'R@vindra', // Replace with your MariaDB root password
  database: 'navibot', // Replace with your database name
  connectionLimit: 5,
});

// Route: Upload user profile image and update the database
app.post('/upload', authMiddleware, uploadProfileImage.single('profileImage'), async (req, res) => {
  const { userId } = req.body;

  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }

  const imageName = req.file.filename;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('UPDATE Users SET image = ? WHERE id = ?', [imageName, userId]);
    conn.release();

    if (result.affectedRows > 0) {
      return res.json({ msg: 'File uploaded and user image updated successfully!' });
    } else {
      return res.status(404).json({ msg: 'User not found.' });
    }
  } catch (error) {
    console.error('Error updating user image:', error);
    return res.status(500).json({ msg: 'Error updating user image.' });
  }
});

// Route: Place a new order with an image
app.post('/order', authMiddleware, uploadOrderImage.single('image'), async (req, res) => {
  console.log('Full request body:', req.body);
  console.log('Files:', req.files);
  console.log('File:', req.file);
  
  let { details, start_location, end_location } = req.body;
  const userId = req.user;
  const image = req.file ? req.file.filename : null;

  console.log('Raw start_location:', start_location);
  console.log('Raw end_location:', end_location);

  // Attempt to parse location data if it's a string
  try {
    if (typeof start_location === 'string') {
      start_location = JSON.parse(start_location);
    }
    if (typeof end_location === 'string') {
      end_location = JSON.parse(end_location);
    }
  } catch (error) {
    console.error('Error parsing location data:', error);
    return res.status(400).json({ msg: 'Invalid location data format', error: error.message });
  }

  console.log('Parsed start_location:', start_location);
  console.log('Parsed end_location:', end_location);

  if (!start_location || !end_location || !start_location.lat || !start_location.lon || !end_location.lat || !end_location.lon) {
    return res.status(400).json({ 
      msg: 'Invalid location data', 
      receivedStartLocation: start_location, 
      receivedEndLocation: end_location 
    });
  }

  try {
    const conn = await pool.getConnection();
    console.log("Placing order...");
    console.log("User ID:", userId);
    console.log("Image:", image);
    console.log("Details:", details);
    console.log("Start location:", JSON.stringify(start_location));
    console.log("End location:", JSON.stringify(end_location));

    const result = await conn.query(
      'INSERT INTO Orders (user_id, image, details, start_location, end_location) VALUES (?, ?, ?, ?, ?)',
      [userId, image, details, JSON.stringify(start_location), JSON.stringify(end_location)]
    );
    conn.release();

    console.log('Order inserted, result:', result);

    console.log('Sending data to Flask server:', {
      src: { lat: start_location.lat, lon: start_location.lon },
      dest: { lat: end_location.lat, lon: end_location.lon }
    });

    try {
      const response = await axios.post("http://localhost:3001/travel", {
        src: { lat: start_location.lat, lon: start_location.lon },
        dest: { lat: end_location.lat, lon: end_location.lon }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Travel API response:', response.data);
    } catch (error) {
      console.error('Error calling Flask server:', error.message);
      // Continue with order creation even if Flask server call fails
    }

    return res.status(201).json({ msg: 'Order created', order_id: Number(result.insertId) });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ msg: 'Error creating order.', error: error.message });
  }
});

// Route: User Registration
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const conn = await pool.getConnection();
    
    const existingUser = await conn.query('SELECT id FROM Users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      conn.release();
      return res.status(409).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await conn.query('INSERT INTO Users (email, username, password) VALUES (?, ?, ?)', [email, username, hashedPassword]);
    conn.release();

    return res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Route: User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const conn = await pool.getConnection();
    const users = await conn.query('SELECT * FROM Users WHERE email = ?', [email]);
    conn.release();

    if (users.length === 0) {
      return res.status(404).json({ msg: 'User does not exist' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Incorrect password' });
    }

    const token = jwt.sign({ user: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ msg: 'Login successful.', token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});