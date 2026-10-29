export default function GenreFilter({ genres, selected, onSelect }) {
  return (
    <div className="chips" role="group" aria-label="Filter by genre">
      {genres.map((g) => (
        <button
          key={g}
          type="button"
          className={`chip ${g === selected ? 'chip-active' : ''}`}
          aria-pressed={g === selected}
          onClick={() => onSelect(g)}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
