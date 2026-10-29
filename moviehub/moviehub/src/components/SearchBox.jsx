import { SORT_OPTIONS } from '../constants.js';

// Controlled search input + sort select. Search runs on submit (Enter or arrow).
export default function SearchBox({ value, onChange, onSubmit, sort, onSortChange }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form className="searchbox" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search any movie by title"
        aria-label="Search movies by title"
      />
      <div className="searchbox-row">
        <select value={sort} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort movies">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button type="submit" className="send" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
