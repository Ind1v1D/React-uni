# MovieHub

A React single page application for browsing movies, reading short info from the
[OMDb API](https://www.omdbapi.com/) and leaving your own 1–10 rating and comment.

**Live demo:** _add your deployed link here_

## Features
- Gallery of movie posters with description, IMDb rating and community rating
- Search by title (OMDb search, first 20 matches)
- Filter by genre, sort (default / rating / year / title), pagination (12 per page)
- Movie details page: large poster, genres, ratings, plot, director, cast
- Controlled form to add your own review (name, rating 1–10, comment), stored in `localStorage`
- Loading, error (with retry), empty and success states

## Tech
React 18, Vite, React Router (HashRouter), plain CSS. Data source: OMDb API only.

## Project structure
```
src/
  api.js            OMDb requests + cache
  storage.js        reviews in localStorage
  constants.js      page size, sort options, featured movie ids
  hooks/useMovies.js  data hooks (useEffect + AbortController cleanup)
  pages/            Home, MovieDetails
  components/       Header, SearchBox, GenreFilter, MovieCard, Poster,
                    Pagination, StatusMessage, ReviewForm, ReviewList
```

## Run locally
```bash
npm install
cp .env.example .env   # put your OMDb key in VITE_OMDB_KEY
npm run dev
```

## Deploy
Push to GitHub, import the repo in Vercel or Netlify (build command `npm run build`,
output directory `dist`) and add the `VITE_OMDB_KEY` environment variable.

## Notes
OMDb has no "list all movies" endpoint, so the home gallery loads a fixed list of
40 IMDb ids. Search results come from OMDb search, then each result is loaded by id
to get its genre and rating.
