import { useState } from 'react';

// Poster image with a text fallback when OMDb has no poster or it fails to load
export default function Poster({ src, title, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || src === 'N/A' || failed) {
    return <div className={`poster poster-fallback ${className}`}>{title}</div>;
  }
  return (
    <img
      className={`poster ${className}`}
      src={src}
      alt={`${title} poster`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
