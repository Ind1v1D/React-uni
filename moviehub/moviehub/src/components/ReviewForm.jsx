import { useState } from 'react';

// Controlled form: adds a new user review (rating 1–10 + comment)
export default function ReviewForm({ onAdd }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setError('Enter your name.');
    if (rating === 0) return setError('Pick a rating from 1 to 10.');
    onAdd({ name: name.trim(), rating, comment: comment.trim() });
    setName('');
    setRating(0);
    setComment('');
    setError('');
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Rate this movie</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        maxLength={30}
        aria-label="Your name"
      />
      <div className="rating-picker" role="group" aria-label="Your rating">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={n <= rating ? 'rate-on' : ''}
            aria-pressed={n === rating}
            onClick={() => setRating(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a short comment (optional)"
        rows={3}
        maxLength={300}
        aria-label="Comment"
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn">Post review</button>
    </form>
  );
}
