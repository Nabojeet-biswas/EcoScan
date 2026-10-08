import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';

interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectFieldOption[];
  disabled?: boolean;
  label: string;
  helperText?: string;
  error?: string;
  name?: string;
  'aria-label'?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ value, onChange, options, disabled = false, label, helperText, error, name, 'aria-label': ariaLabel }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!disabled) onChange(e.target.value);
    };

    return (
      <div className="w-full">
        <label htmlFor={name} className="block">
          <span className="font-medium text-fg">{label}</span>
          {helperText && !error && <span className="text-fg-dim text-xs mt-0.5 block">{helperText}</span>}
        </label>
        <div className="mt-1.5 relative">
          <select
            ref={ref}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            aria-label={ariaLabel ?? label}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
            className={clsx(
              'w-full appearance-none px-3 py-2.5 rounded-xl bg-bg-surface border text-fg text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface',
              'hover-solid',
              disabled ? 'opacity-50 cursor-not-allowed' : '',
              error ? 'border-error' : 'border-line'
            )}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-fg-dim">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p id={`${name}-error`} className="mt-1.5 text-xs text-error" role="alert">{error}</p>
        )}
        {helperText && !error && (
          <p id={`${name}-helper`} className="mt-1.5 text-xs text-fg-dim">{helperText}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';