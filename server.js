const express = require("express");
const { check, validationResult } = require("express-validator");
const app = express();
const port = 3006;
const mysql = require("mysql2");
const multer = require('multer'); // Middleware for handling multipart/form-data
const fs = require('fs'); // File system module for working with files

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "User_info",
  port: 3306,
});

app.use("/", express.static("./website"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validation middleware for user data insertion
const validateInsert = [
  check('Name').isLength({ min: 1, max: 100 }).withMessage('The full name must be between 1 and 100 chars in length')
    .isString().withMessage('The name must be of type string')
    .trim().escape(),
  check('Email').isEmail().withMessage('Invalid email format')
    .isLength({ max: 150 }).withMessage('Email must be at most 150 characters')
    .trim().escape(),  
  check('Phone').isLength({ min: 9, max: 9 }).withMessage('Mobile number must be 9 digits')
    .isNumeric().withMessage('Mobile number must contain numbers only'),
  check('Password').isLength({ min: 8, max: 30 }).withMessage('Password must contain letters and numbers')
    .isLength({max: 30}).withMessage('Password must be at most 8 characters')
  
  
];


app.post("/insert", validateInsert, (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const data = {
      Name: req.body.Name,
      Email: req.body.Email,
      Phone: req.body.Phone,
      Password: req.body.Password,
    };
  
    const query = "INSERT INTO User SET ?";
    pool.query(query, data, (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      res.send("Data inserted successfully!");
    });
})
// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for handling file uploads
app.post('/upload', upload.single('ecgImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imagePath = req.file.path;

    // Process the uploaded image
    processImage(imagePath)
        .then((result) => {
            // Send processed data back to client
            res.send(result);
        })
        .catch((error) => {
            console.error('Error processing image:', error);
            // Send error response back to client
            res.status(500).send('Error processing image.');
        });
});

// Function to process the uploaded image
function processImage(imagePath) {
    return new Promise((resolve, reject) => {
        // Here, you can implement the image processing logic using libraries like OpenCV or PIL
        // For demonstration, we'll simply read the image file and return its contents

        fs.readFile(imagePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                // Resolve with the image data
                resolve(data);
            }
        });
    });
}


