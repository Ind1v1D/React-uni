const API_KEY = import.meta.env.VITE_OMDB_KEY || '7e8dd278';
const BASE_URL = 'https://www.omdbapi.com/';

// Simple in-memory cache so the same movie is never fetched twice
const movieCache = new Map();

async function request(params, signal) {
  const query = new URLSearchParams({ ...params, apikey: API_KEY });
  const res = await fetch(`${BASE_URL}?${query}`, { signal });
  if (!res.ok) throw new Error(`Network error (${res.status})`);
  return res.json();
}

// Full details of one movie (genre, rating, plot, ...)
export async function getMovie(id, signal) {
  if (movieCache.has(id)) return movieCache.get(id);
  const data = await request({ i: id, plot: 'short' }, signal);
  if (data.Response === 'False') throw new Error(data.Error || 'Movie not found');
  movieCache.set(id, data);
  return data;
}

// Search by title: OMDb returns 10 results per page, we load the first 2 pages.
// Search results have no genre, so callers load details for each id afterwards.
export async function searchMovieIds(title, signal) {
  const [first, second] = await Promise.all(
    [1, 2].map((page) => request({ s: title, type: 'movie', page }, signal))
  );
  if (first.Response === 'False') {
    if (first.Error === 'Movie not found!') return [];
    throw new Error(first.Error || 'Search failed');
  }
  const items = [...first.Search, ...(second.Response === 'True' ? second.Search : [])];
  return [...new Set(items.map((m) => m.imdbID))];
}
