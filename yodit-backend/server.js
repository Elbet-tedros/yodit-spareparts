const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Path to reviews.json
const DATA_FILE = path.join(__dirname, 'reviews.json');

// Functions to get/save reviews
function getReviews() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveReviews(reviews) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2));
}

// API routes
app.get('/reviews', (req, res) => res.json(getReviews()));
app.post('/reviews', (req, res) => {
  const { name, email, message, rating } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required' });

  const reviews = getReviews();
  const newReview = { id: Date.now(), name, email, message, rating: rating || 0, date: new Date() };
  reviews.push(newReview);
  saveReviews(reviews);
  res.status(201).json(newReview);
});

// --- Serve frontend static files from project root ---
app.use(express.static(path.join(__dirname, '..')));

// Handle root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
