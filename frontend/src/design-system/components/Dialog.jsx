import { useEffect } from 'react';
import { X } from 'lucide-react';
import './Dialog.css';

export function Dialog({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="ds-dialog-overlay" onClick={onClose}>
      <div
        className="ds-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ds-dialog__header">
          <h2 className="ds-dialog__title">{title}</h2>
          <button type="button" className="ds-dialog__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
