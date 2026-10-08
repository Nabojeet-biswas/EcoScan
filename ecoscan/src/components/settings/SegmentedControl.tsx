import { clsx } from 'clsx';
import { forwardRef } from 'react';

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: SegmentedControlOption[];
  disabled?: boolean;
  label: string;
  helperText?: string;
  'aria-label'?: string;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ value, onChange, options, disabled = false, label, helperText, 'aria-label': ariaLabel }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = options.findIndex(o => o.value === value);
        const nextIndex = Math.min(currentIndex + 1, options.length - 1);
        onChange(options[nextIndex].value);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentIndex = options.findIndex(o => o.value === value);
        const prevIndex = Math.max(currentIndex - 1, 0);
        onChange(options[prevIndex].value);
      } else if (e.key === 'Home') {
        e.preventDefault();
        onChange(options[0].value);
      } else if (e.key === 'End') {
        e.preventDefault();
        onChange(options[options.length - 1].value);
      }
    };

    return (
      <div ref={ref} className="w-full" role="radiogroup" aria-label={ariaLabel ?? label}>
        <label className="block">
          <span className="font-medium text-fg">{label}</span>
          {helperText && <span className="text-fg-dim text-xs mt-0.5 block">{helperText}</span>}
        </label>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label={ariaLabel ?? label}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={value === option.value}
              aria-label={option.label}
              disabled={disabled}
              onClick={() => !disabled && onChange(option.value)}
              onKeyDown={handleKeyDown}
              className={clsx(
                'flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface',
                'hover-solid',
                value === option.value
                  ? 'bg-brand text-white border border-brand'
                  : 'text-fg-dim bg-bg-surface border border-line',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';