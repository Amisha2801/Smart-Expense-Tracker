import { CircleCheck, CircleAlert } from 'lucide-react';
import './StatusBanner.css';

export function StatusBanner({ error, message }) {
  if (!error && !message) {
    return null;
  }

  if (error) {
    return (
      <div className="ds-status-banner ds-status-banner--negative" role="alert">
        <CircleAlert />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="ds-status-banner ds-status-banner--positive" role="status">
      <CircleCheck />
      <p>{message}</p>
    </div>
  );
}
