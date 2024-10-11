import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mariadb from 'mariadb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './middleware/authMiddleware.js';

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

// MariaDB connection pool
const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'pipi', // Replace with your MariaDB root password
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
  const { details, start_location, end_location } = req.body;
  console.log(req.body)
  const userId = req.user;
  const image = req.file ? req.file.filename : null;

  if (!image || !details || !start_location || !end_location) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO Orders (user_id, image, details, start_location, end_location) VALUES (?, ?, ?, ?, ?)',
      [userId, image, details, start_location, end_location]
    );
    conn.release();

    return res.status(201).json({ msg: 'Order created', order_id: Number(result.insertId) });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ msg: 'Error creating order.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
