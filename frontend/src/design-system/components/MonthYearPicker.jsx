import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './Field.css';
import './MonthYearPicker.css';

const MONTH_LABELS = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'short' })
);

const PANEL_WIDTH = 236;

function parseMonthKey(monthKey) {
  if (!monthKey) return null;
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return null;
  return { year, month: month - 1 };
}

function formatMonthKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

export function MonthYearPicker({ label, className = '', value, onChange, disabled }) {
  const today = useMemo(() => new Date(), []);
  const selected = parseMonthKey(value);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected?.year ?? today.getFullYear());
  const [highlighted, setHighlighted] = useState(selected?.month ?? today.getMonth());
  const [align, setAlign] = useState('left');

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const overflowsRight = rect.left + PANEL_WIDTH > window.innerWidth - 16;
    setAlign(overflowsRight ? 'right' : 'left');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    gridRef.current?.focus();
  }, [open]);

  function openPanel() {
    if (disabled) return;
    setViewYear(selected?.year ?? today.getFullYear());
    setHighlighted(selected?.month ?? today.getMonth());
    setOpen(true);
  }

  function closePanel({ refocus = false } = {}) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function commit(monthIndex, year = viewYear) {
    onChange?.({ target: { value: formatMonthKey(year, monthIndex) } });
    closePanel({ refocus: true });
  }

  function shiftYear(delta) {
    setViewYear((y) => y + delta);
  }

  function handleTriggerKeyDown(e) {
    if (disabled || open) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPanel();
    }
  }

  function handleGridKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        e.stopPropagation();
        setHighlighted((m) => (m + 1) % 12);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        e.stopPropagation();
        setHighlighted((m) => (m + 11) % 12);
        break;
      case 'ArrowDown':
        e.preventDefault();
        e.stopPropagation();
        setHighlighted((m) => (m + 3) % 12);
        break;
      case 'ArrowUp':
        e.preventDefault();
        e.stopPropagation();
        setHighlighted((m) => (m + 9) % 12);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        e.stopPropagation();
        commit(highlighted);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        closePanel({ refocus: true });
        break;
      case 'PageUp':
        e.preventDefault();
        e.stopPropagation();
        shiftYear(-1);
        break;
      case 'PageDown':
        e.preventDefault();
        e.stopPropagation();
        shiftYear(1);
        break;
      default:
        break;
    }
  }

  const triggerLabel = selected
    ? new Date(selected.year, selected.month, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Select month';

  const control = (
    <div
      className={`ds-mypicker${label ? ' ds-mypicker--block' : ''}${className ? ` ${className}` : ''}`}
      ref={rootRef}
    >
      <button
        type="button"
        ref={triggerRef}
        className="ds-mypicker__trigger"
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Calendar size={15} className="ds-mypicker__icon" aria-hidden="true" />
        <span className="ds-mypicker__value">{triggerLabel}</span>
        <ChevronDown size={15} className="ds-mypicker__chevron" aria-hidden="true" />
      </button>

      {open && (
        <div
          className={`ds-mypicker__panel${align === 'right' ? ' ds-mypicker__panel--right' : ''}`}
          role="dialog"
          aria-label="Choose month and year"
        >
          <div className="ds-mypicker__year-row">
            <button
              type="button"
              className="ds-mypicker__year-btn"
              onClick={() => shiftYear(-1)}
              aria-label="Previous year"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="ds-mypicker__year figs">{viewYear}</span>
            <button
              type="button"
              className="ds-mypicker__year-btn"
              onClick={() => shiftYear(1)}
              aria-label="Next year"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div
            className="ds-mypicker__grid"
            ref={gridRef}
            tabIndex={-1}
            onKeyDown={handleGridKeyDown}
          >
            {MONTH_LABELS.map((monthLabel, index) => {
              const isSelected = selected?.year === viewYear && selected?.month === index;
              const isCurrent = today.getFullYear() === viewYear && today.getMonth() === index;
              return (
                <button
                  key={monthLabel}
                  type="button"
                  className={`ds-mypicker__month${isSelected ? ' ds-mypicker__month--selected' : ''}${
                    index === highlighted ? ' ds-mypicker__month--active' : ''
                  }${isCurrent && !isSelected ? ' ds-mypicker__month--current' : ''}`}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => commit(index)}
                >
                  {monthLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (!label) {
    return control;
  }

  return (
    <div className="ds-field">
      <span className="ds-field__label">{label}</span>
      {control}
    </div>
  );
}
