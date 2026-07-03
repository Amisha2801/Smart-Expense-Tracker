function StatusMessage({ error, message }) {
  if (!error && !message) {
    return null;
  }

  if (error) {
    return (
      <div className="status-banner status-banner-error" role="alert">
        <span className="status-banner-icon" aria-hidden="true">
          ⚠️
        </span>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="status-banner status-banner-success" role="status">
      <span className="status-banner-icon" aria-hidden="true">
        ✅
      </span>
      <p>{message}</p>
    </div>
  );
}

export default StatusMessage;
