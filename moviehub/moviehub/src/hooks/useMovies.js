import { useEffect, useState } from 'react';
import { getMovie, searchMovieIds } from '../api.js';
import { FEATURED_IDS } from '../constants.js';

// Gallery data: featured movies, or search results when a title is given.
export function useMovies(title) {
  const [state, setState] = useState({ status: 'loading', movies: [], error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Cleanup aborts the previous request, so a slow old response
    // can never overwrite a newer one (race condition).
    const controller = new AbortController();
    const { signal } = controller;
    setState({ status: 'loading', movies: [], error: null });

    async function load() {
      try {
        const ids = title ? await searchMovieIds(title, signal) : FEATURED_IDS;
        const results = await Promise.allSettled(ids.map((id) => getMovie(id, signal)));
        if (signal.aborted) return;
        const movies = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
        if (ids.length > 0 && movies.length === 0) {
          throw new Error('Could not load movies. Check your connection or API key.');
        }
        setState({ status: 'success', movies, error: null });
      } catch (err) {
        if (signal.aborted) return;
        setState({ status: 'error', movies: [], error: err.message });
      }
    }

    load();
    return () => controller.abort();
  }, [title, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}

// Single movie for the details page
export function useMovie(id) {
  const [state, setState] = useState({ status: 'loading', movie: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', movie: null, error: null });

    getMovie(id, controller.signal)
      .then((movie) => setState({ status: 'success', movie, error: null }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', movie: null, error: err.message });
      });

    return () => controller.abort();
  }, [id, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
