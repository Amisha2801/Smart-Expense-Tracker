import { Children, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import './Field.css';
import './Select.css';

function parseOptions(children) {
  return Children.toArray(children)
    .filter((child) => child?.type === 'option')
    .map((child) => ({
      value: String(child.props.value ?? ''),
      label: child.props.children,
      disabled: !!child.props.disabled,
    }));
}

export function Select({ label, className = '', value, onChange, disabled, children }) {
  const options = useMemo(() => parseOptions(children), [children]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(null);
  const [align, setAlign] = useState('left');

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const typeaheadRef = useRef({ buffer: '', timer: null });
  const labelId = useId();

  const selectedValue = value === undefined || value === null ? '' : String(value);
  const selectedOption = options.find((o) => o.value === selectedValue);

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
    const menuWidth = Math.max(rect.width, 160);
    const overflowsRight = rect.left + menuWidth > window.innerWidth - 16;
    setAlign(overflowsRight ? 'right' : 'left');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || highlighted == null || !menuRef.current) return;
    const node = menuRef.current.querySelector(`[data-value="${CSS.escape(highlighted)}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [open, highlighted]);

  function openMenu() {
    if (disabled || options.length === 0) return;
    const start = selectedOption ? selectedOption.value : options.find((o) => !o.disabled)?.value ?? null;
    setHighlighted(start);
    setOpen(true);
  }

  function closeMenu({ refocus = false } = {}) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function commit(option) {
    if (!option || option.disabled) return;
    onChange?.({ target: { value: option.value } });
    closeMenu({ refocus: true });
  }

  function moveHighlight(delta) {
    const enabled = options.filter((o) => !o.disabled);
    if (enabled.length === 0) return;
    const currentIndex = enabled.findIndex((o) => o.value === highlighted);
    const nextIndex = Math.max(0, Math.min(enabled.length - 1, currentIndex + delta));
    setHighlighted(enabled[nextIndex].value);
  }

  function handleTriggerKeyDown(e) {
    if (disabled || open) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMenu();
    }
  }

  function handleMenuKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        e.stopPropagation();
        moveHighlight(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        e.stopPropagation();
        moveHighlight(-1);
        break;
      case 'Home': {
        e.preventDefault();
        e.stopPropagation();
        const first = options.find((o) => !o.disabled);
        if (first) setHighlighted(first.value);
        break;
      }
      case 'End': {
        e.preventDefault();
        e.stopPropagation();
        const enabled = options.filter((o) => !o.disabled);
        const last = enabled[enabled.length - 1];
        if (last) setHighlighted(last.value);
        break;
      }
      case 'Enter':
      case ' ':
        e.preventDefault();
        e.stopPropagation();
        commit(options.find((o) => o.value === highlighted));
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        closeMenu({ refocus: true });
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const buffer = typeaheadRef.current.buffer + e.key.toLowerCase();
          typeaheadRef.current.buffer = buffer;
          clearTimeout(typeaheadRef.current.timer);
          typeaheadRef.current.timer = setTimeout(() => {
            typeaheadRef.current.buffer = '';
          }, 500);
          const match = options.find(
            (o) => !o.disabled && String(o.label).toLowerCase().startsWith(buffer)
          );
          if (match) setHighlighted(match.value);
        }
    }
  }

  const triggerLabel = selectedOption?.label ?? '';

  const control = (
    <div
      className={`ds-select${label ? ' ds-select--block' : ''}${className ? ` ${className}` : ''}`}
      ref={rootRef}
    >
      <button
        type="button"
        ref={triggerRef}
        className="ds-select__trigger"
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? labelId : undefined}
      >
        <span className={`ds-select__value${selectedOption ? '' : ' ds-select__value--placeholder'}`}>
          {triggerLabel}
        </span>
        <ChevronDown size={16} className="ds-select__chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul
          className={`ds-select__menu${align === 'right' ? ' ds-select__menu--right' : ''}`}
          role="listbox"
          ref={menuRef}
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
        >
          {options.map((option) => (
            <li
              key={option.value}
              data-value={option.value}
              role="option"
              aria-selected={option.value === selectedValue}
              aria-disabled={option.disabled || undefined}
              className={`ds-select__option${
                option.value === highlighted ? ' ds-select__option--active' : ''
              }${option.disabled ? ' ds-select__option--disabled' : ''}`}
              onMouseEnter={() => !option.disabled && setHighlighted(option.value)}
              onClick={() => commit(option)}
            >
              <span>{option.label}</span>
              {option.value === selectedValue && (
                <Check size={14} className="ds-select__check" aria-hidden="true" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (!label) {
    return control;
  }

  return (
    <div className="ds-field">
      <span className="ds-field__label" id={labelId}>{label}</span>
      {control}
    </div>
  );
}
