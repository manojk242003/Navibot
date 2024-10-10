import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
const app = express();
const port = 5000;

app.use(cors({origin:'*'}))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'profile_images');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the upload directory path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('profileImage'), (req, res) => {
  res.send('File uploaded successfully!');
});
app.get("/health", (req, res) => {
  res.send("RPI server is healthy bro");
});




app.post("/register",(req,res)=>{
  const {username, password} = req.body

})



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

