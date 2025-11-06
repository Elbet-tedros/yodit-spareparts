const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = 'reviews.json';

// Read reviews
function getReviews() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save reviews
function saveReviews(reviews) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2));
}

// GET all reviews
app.get('/reviews', (req, res) => {
  const reviews = getReviews();
  res.json(reviews);
});

// POST new review
app.post('/reviews', (req, res) => {
  const { name, email, message, rating } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const reviews = getReviews();
  const newReview = {
    id: Date.now(),
    name,
    email,
    message,
    rating: rating || 0,
    date: new Date()
  };

  reviews.push(newReview);
  saveReviews(reviews);

  res.status(201).json(newReview);
});
// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// Handle root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
