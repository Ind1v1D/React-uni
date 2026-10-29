export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p className="muted">No reviews yet. Be the first to rate this movie.</p>;
  }
  return (
    <ul className="reviews">
      {reviews.map((r) => (
        <li key={r.id} className="review">
          <div className="review-head">
            <strong>{r.name}</strong>
            <span className="badge badge-user">{r.rating}/10</span>
          </div>
          {r.comment && <p>{r.comment}</p>}
          <time dateTime={r.date}>{new Date(r.date).toLocaleDateString()}</time>
        </li>
      ))}
    </ul>
  );
}
