// Shows the loading, error and empty states
export default function StatusMessage({ type, message, onRetry }) {
  if (type === 'loading') {
    return (
      <div className="status" role="status">
        <div className="spinner" />
        <p>{message || 'Loading…'}</p>
      </div>
    );
  }
  return (
    <div className="status" role={type === 'error' ? 'alert' : 'status'}>
      <p className="status-title">{type === 'error' ? 'Something went wrong' : 'Nothing here'}</p>
      <p>{message}</p>
      {onRetry && <button type="button" className="btn" onClick={onRetry}>Try again</button>}
    </div>
  );
}
