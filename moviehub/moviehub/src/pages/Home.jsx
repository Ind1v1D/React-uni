import { useMemo, useState } from 'react';
import { useMovies } from '../hooks/useMovies.js';
import { loadAllReviews, averageRating } from '../storage.js';
import { PAGE_SIZE } from '../constants.js';
import SearchBox from '../components/SearchBox.jsx';
import GenreFilter from '../components/GenreFilter.jsx';
import MovieCard from '../components/MovieCard.jsx';
import Pagination from '../components/Pagination.jsx';
import StatusMessage from '../components/StatusMessage.jsx';

const rating = (m) => (m.imdbRating === 'N/A' ? 0 : parseFloat(m.imdbRating));
const year = (m) => parseInt(m.Year, 10) || 0;

function sortMovies(movies, sort) {
  const list = [...movies]; // never mutate state
  if (sort === 'rating') list.sort((a, b) => rating(b) - rating(a));
  if (sort === 'year') list.sort((a, b) => year(b) - year(a));
  if (sort === 'title') list.sort((a, b) => a.Title.localeCompare(b.Title));
  return list;
}

export default function Home() {
  const [input, setInput] = useState(''); // what the user is typing
  const [search, setSearch] = useState(''); // submitted search term
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const [allReviews] = useState(loadAllReviews);

  const { status, movies, error, retry } = useMovies(search);

  const genres = useMemo(() => {
    const all = movies.flatMap((m) => (m.Genre === 'N/A' ? [] : m.Genre.split(', ')));
    return ['All', ...[...new Set(all)].sort()];
  }, [movies]);

  const visible = useMemo(() => {
    const filtered = genre === 'All' ? movies : movies.filter((m) => m.Genre.split(', ').includes(genre));
    return sortMovies(filtered, sort);
  }, [movies, genre, sort]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearch() {
    setSearch(input.trim());
    setGenre('All');
    setPage(1);
  }

  function handleClear() {
    setInput('');
    setSearch('');
    setGenre('All');
    setPage(1);
  }

  function handleGenre(g) {
    setGenre(g);
    setPage(1);
  }

  function handleSort(value) {
    setSort(value);
    setPage(1);
  }

  return (
    <>
      <section className="hero">
        <p className="hero-note">
          <span className="spark">✦</span> Browse the OMDb library and rate the movies you watch
        </p>
        <h1>Into the Spotlight</h1>
        <SearchBox
          value={input}
          onChange={setInput}
          onSubmit={handleSearch}
          sort={sort}
          onSortChange={handleSort}
        />
      </section>

      <section className="gallery" aria-live="polite">
        <div className="gallery-head">
          <h2>{search ? `Results for “${search}”` : 'Featured movies'}</h2>
          {search && (
            <button type="button" className="link-btn" onClick={handleClear}>Clear search</button>
          )}
        </div>

        {status === 'loading' && <StatusMessage type="loading" message="Loading movies…" />}
        {status === 'error' && <StatusMessage type="error" message={error} onRetry={retry} />}
        {status === 'success' && movies.length === 0 && (
          <StatusMessage type="empty" message={`No movies found for “${search}”. Try another title.`} />
        )}

        {status === 'success' && movies.length > 0 && (
          <>
            <GenreFilter genres={genres} selected={genre} onSelect={handleGenre} />
            {visible.length === 0 ? (
              <StatusMessage type="empty" message="No movies in this genre." />
            ) : (
              <div className="grid">
                {pageItems.map((m) => (
                  <MovieCard key={m.imdbID} movie={m} userRating={averageRating(allReviews[m.imdbID])} />
                ))}
              </div>
            )}
            <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}
