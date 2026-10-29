import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo" aria-label="MovieHub home">
        <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
          <rect width="34" height="34" rx="10" fill="#4d6bfe" />
          <path d="M13 10.5v13l11-6.5z" fill="#fff" />
        </svg>
        <span>MovieHub</span>
      </Link>
      <nav>
        <Link to="/" className="nav-link">Gallery</Link>
      </nav>
    </header>
  );
}
