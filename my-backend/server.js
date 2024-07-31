const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      motto TEXT,
      profilePic TEXT
    )
  `);

  // Insert default user data if the table is empty
  db.get('SELECT COUNT(*) AS count FROM user', (err, row) => {
    if (row.count === 0) {
      db.run('INSERT INTO user (name, motto) VALUES (?, ?)', ['John Mark', 'Motto in life']);
    }
  });
});

// Get user data
app.get('/user', (req, res) => {
  db.get('SELECT * FROM user WHERE id = 1', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

// Update user data
app.post('/user', (req, res) => {
  const { name, motto, profilePic } = req.body;
  db.run('UPDATE user SET name = ?, motto = ?, profilePic = ? WHERE id = 1', [name, motto, profilePic], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ name, motto, profilePic });
    }
  });
});

// Handle file upload
app.post('/upload', upload.single('profilePic'), (req, res) => {
  const file = req.file;
  if (file) {
    // Move file to a proper location
    const extname = path.extname(file.originalname);
    const newFilePath = path.join('uploads', file.filename + extname);
    fs.rename(file.path, newFilePath, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Update user profile picture URL in database
      const profilePicUrl = '/uploads/' + file.filename + extname;
      db.run('UPDATE user SET profilePic = ? WHERE id = 1', [profilePicUrl], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ profilePicUrl });
      });
    });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
