import { clsx } from 'clsx';
import { forwardRef } from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
  helperText?: string;
  name?: string;
  'aria-label'?: string;
}

export const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  ({ checked, onChange, disabled = false, label, helperText, name, 'aria-label': ariaLabel }, ref) => {
    const handleClick = () => {
      if (!disabled) onChange(!checked);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!disabled) onChange(!checked);
      }
    };

    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <label htmlFor={name} className="block">
            <span className="font-medium text-fg">{label}</span>
            {helperText && <span className="text-fg-dim text-xs mt-0.5 block">{helperText}</span>}
          </label>
        </div>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={ariaLabel ?? label}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={clsx(
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface',
            checked
              ? 'bg-brand border-brand'
              : 'bg-bg-surface border-line',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span
            className={clsx(
              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-150',
              'shadow-sm',
              checked ? 'translate-x-full' : 'translate-x-0'
            )}
            aria-hidden="true"
          />
        </button>
      </div>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';