import { Link } from 'react-router-dom';
import Poster from './Poster.jsx';

export default function MovieCard({ movie, userRating }) {
  const imdb = movie.imdbRating !== 'N/A' ? movie.imdbRating : '–';
  const genre = movie.Genre !== 'N/A' ? movie.Genre.split(', ')[0] : '';

  return (
    <Link to={`/movie/${movie.imdbID}`} className="card">
      <Poster src={movie.Poster} title={movie.Title} />
      <div className="card-body">
        <h3>{movie.Title}</h3>
        <p className="card-meta">{[movie.Year, genre].filter(Boolean).join(' • ')}</p>
        <p className="card-plot">{movie.Plot !== 'N/A' ? movie.Plot : 'No description available.'}</p>
        <div className="badges">
          <span className="badge badge-imdb">IMDb {imdb}</span>
          {userRating !== null && <span className="badge badge-user">Users {userRating.toFixed(1)}</span>}
        </div>
      </div>
    </Link>
  );
}
