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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.png`);
  },
});
const upload = multer({ storage: storage });

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
  db.run(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      deadline TEXT,
      createdAt TEXT,
      type TEXT DEFAULT 'goal'
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

// Clean up unused files
const cleanupUnusedFiles = () => {
  // Get all profilePic references from the database
  db.all('SELECT profilePic FROM user', (err, rows) => {
    if (err) {
      console.error('Error fetching profile pics from database:', err.message);
      return;
    }

    const referencedFiles = rows.map(row => path.basename(row.profilePic));

    // List all files in the uploads directory
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
      if (err) {
        console.error('Error reading uploads directory:', err.message);
        return;
      }

      // Identify files not referenced in the database
      const unusedFiles = files.filter(file => !referencedFiles.includes(file));

      // Delete each unused file
      unusedFiles.forEach(file => {
        fs.unlink(path.join(__dirname, 'uploads', file), err => {
          if (err) {
            console.error('Error deleting file:', err.message);
          } else {
            console.log(`Deleted unused file: ${file}`);
          }
        });
      });
    });
  });
};

// Get all goals
app.get('/goals', (req, res) => {
  db.all('SELECT * FROM goals', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a new goal
app.post('/goals', (req, res) => {
  const { title, deadline, type = 'goal' } = req.body;
  const createdAt = new Date().toISOString();

  db.run('INSERT INTO goals (title, deadline, createdAt, type) VALUES (?, ?, ?, ?)', [title, deadline, createdAt, type], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      title,
      deadline,
      createdAt,
      type
    });
  });
});

// Clear all goals
app.delete('/goals', (req, res) => {
  db.run('DELETE FROM goals', function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).send("All tasks cleared.");
  });
});

// Handle file upload
app.post('/upload', upload.single('profilePic'), (req, res) => {
  const file = req.file;
  if (file) {
    // Check and delete the existing profile picture if any
    db.get('SELECT profilePic FROM user WHERE id = 1', (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (row && row.profilePic) {
        const oldFilePath = path.join(__dirname, row.profilePic);
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: err.message });
          }

          // Move new file to a proper location
          const profilePicUrl = '/uploads/' + file.filename;
          db.run('UPDATE user SET profilePic = ? WHERE id = 1', [profilePicUrl], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Clean up unused files
            cleanupUnusedFiles();

            res.json({ profilePicUrl });
          });
        });
      } else {
        // Move new file to a proper location
        const profilePicUrl = '/uploads/' + file.filename;
        db.run('UPDATE user SET profilePic = ? WHERE id = 1', [profilePicUrl], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // Clean up unused files
          cleanupUnusedFiles();

          res.json({ profilePicUrl });
        });
      }
    });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
