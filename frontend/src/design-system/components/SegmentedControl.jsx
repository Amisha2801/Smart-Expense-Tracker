import './SegmentedControl.css';

export function SegmentedControl({ options, value, onChange, ariaLabel }) {
  return (
    <div className="ds-segmented" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`ds-segmented__option${
            option.value === value ? ' ds-segmented__option--active' : ''
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
