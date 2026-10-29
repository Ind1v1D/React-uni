export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={p === page ? 'page-active' : ''}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" disabled={page === totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  );
}
