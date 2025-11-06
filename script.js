// -------------------------------
// AutoParts Ethiopia - Main Script
// -------------------------------

// Toggle mobile menu visibility
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  menu.classList.toggle('show');
}

// Optional: Close menu when a link is clicked (on small screens)
document.addEventListener('click', function(event) {
  const navMenu = document.getElementById('navMenu');
  const toggleBtn = document.querySelector('.menu-toggle');

  // If clicking outside the menu when it's open, close it
  if (navMenu.classList.contains('show') && 
      !navMenu.contains(event.target) &&
      !toggleBtn.contains(event.target)) {
    navMenu.classList.remove('show');
  }
});

const reviewForm = document.querySelector('.review-form');

reviewForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = {
    name: reviewForm.name.value,
    email: reviewForm.email.value,
    message: reviewForm.message.value,
    rating: reviewForm.rating.value
  };

  try {
    const res = await fetch('http://localhost:3000/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
  const newReview = await res.json();
  addReviewCard(newReview); // show new review instantly
  reviewForm.reset();
  selectStars(0); // reset stars
}
 else {
      const data = await res.json();
      alert(data.error || 'Something went wrong');
    }
  } catch (err) {
    alert('Server not reachable');
    console.error(err);
  }
});

// Function to load reviews
async function loadReviews() {
  const reviewsContainer = document.querySelector('.reviews-list');
  const res = await fetch('http://localhost:3000/reviews');
  const reviews = await res.json();

  reviewsContainer.innerHTML = '';
  reviews.reverse().forEach(r => {
    const card = document.createElement('div');
    card.classList.add('review-card');
    card.innerHTML = `
      <p>"${r.message}"</p>
      <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <h4>- ${r.name}</h4>
    `;
    reviewsContainer.appendChild(card);
  });
}
function addReviewCard(r) {
  const reviewsContainer = document.querySelector('.reviews-list');
  const card = document.createElement('div');
  card.classList.add('review-card');
  card.innerHTML = `
    <p>"${r.message}"</p>
    <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
    <h4>- ${r.name}</h4>
  `;
  reviewsContainer.prepend(card);
}


// Load reviews on page load
loadReviews();

// Star rating functionality
const stars = document.querySelectorAll('.star-input span');
const ratingInput = document.querySelector('input[name="rating"]');

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    const value = star.dataset.value;
    highlightStars(value);
  });

  star.addEventListener('mouseout', () => {
    resetStars();
  });

  star.addEventListener('click', () => {
    const value = star.dataset.value;
    ratingInput.value = value;
    selectStars(value);
  });
});

function highlightStars(value) {
  stars.forEach(star => {
    star.classList.toggle('hover', star.dataset.value <= value);
  });
}

function resetStars() {
  const selectedValue = ratingInput.value;
  stars.forEach(star => {
    star.classList.toggle('hover', false);
  });
}

function selectStars(value) {
  stars.forEach(star => {
    star.classList.toggle('selected', star.dataset.value <= value);
  });
}
