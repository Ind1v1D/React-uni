// User reviews are kept in localStorage: { [imdbID]: Review[] }
const KEY = 'moviehub-reviews';

export function loadAllReviews() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveReviews(movieId, reviews) {
  const all = loadAllReviews();
  all[movieId] = reviews;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — reviews just won't persist */
  }
}

export function averageRating(reviews = []) {
  if (reviews.length === 0) return null;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
