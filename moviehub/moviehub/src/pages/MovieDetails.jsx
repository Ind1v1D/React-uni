import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMovie } from '../hooks/useMovies.js';
import { loadAllReviews, saveReviews, averageRating } from '../storage.js';
import Poster from '../components/Poster.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import ReviewList from '../components/ReviewList.jsx';

const clean = (value) => (value && value !== 'N/A' ? value : null);

function MovieView({ id }) {
  const { status, movie, error, retry } = useMovie(id);
  const [reviews, setReviews] = useState(() => loadAllReviews()[id] || []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  function handleAdd(review) {
    const next = [
      { ...review, id: Date.now().toString(36) + Math.random().toString(36).slice(2), date: new Date().toISOString() },
      ...reviews,
    ];
    setReviews(next);
    saveReviews(id, next);
  }

  if (status === 'loading') return <StatusMessage type="loading" message="Loading movie…" />;
  if (status === 'error') return <StatusMessage type="error" message={error} onRetry={retry} />;

  const userAvg = averageRating(reviews);
  const facts = [
    ['Director', clean(movie.Director)],
    ['Cast', clean(movie.Actors)],
    ['Runtime', clean(movie.Runtime)],
    ['Language', clean(movie.Language)],
    ['Awards', clean(movie.Awards)],
  ].filter(([, value]) => value);

  return (
    <>
      <section className="details">
        <Poster src={movie.Poster} title={movie.Title} className="details-poster" />
        <div className="details-info">
          <h1>{movie.Title} <span className="details-year">({movie.Year})</span></h1>

          {clean(movie.Genre) && (
            <div className="chips chips-left">
              {movie.Genre.split(', ').map((g) => <span key={g} className="chip chip-static">{g}</span>)}
            </div>
          )}

          <div className="ratings">
            <div className="rating-box">
              <strong>{clean(movie.imdbRating) ?? '–'}</strong>
              <span>IMDb rating</span>
            </div>
            <div className="rating-box">
              <strong>{userAvg !== null ? userAvg.toFixed(1) : '–'}</strong>
              <span>{reviews.length} user {reviews.length === 1 ? 'review' : 'reviews'}</span>
            </div>
          </div>

          <p className="details-plot">{clean(movie.Plot) ?? 'No description available.'}</p>

          <dl className="facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="reviews-section">
        <ReviewForm key={id} onAdd={handleAdd} />
        <div>
          <h3>User reviews</h3>
          <ReviewList reviews={reviews} />
        </div>
      </section>
    </>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  return (
    <div className="page">
      <Link to="/" className="back">← Back to gallery</Link>
      {/* key = id: a different movie always starts with fresh state */}
      <MovieView key={id} id={id} />
    </div>
  );
}
