import { clsx } from 'clsx';
import { forwardRef } from 'react';

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'url' | 'tel';
  placeholder?: string;
  disabled?: boolean;
  label: string;
  helperText?: string;
  error?: string;
  name?: string;
  'aria-label'?: string;
  maxLength?: number;
  required?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ value, onChange, onBlur, type = 'text', placeholder, disabled = false, label, helperText, error, name, 'aria-label': ariaLabel, maxLength, required = false }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) onChange(e.target.value);
    };

    const handleBlur = () => {
      if (onBlur) onBlur();
    };

    return (
      <div className="w-full">
        <label htmlFor={name} className="block">
          <span className="font-medium text-fg">{label}</span>
          {helperText && !error && <span className="text-fg-dim text-xs mt-0.5 block">{helperText}</span>}
        </label>
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          aria-label={ariaLabel ?? label}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          className={clsx(
            'w-full px-3 py-2.5 rounded-xl bg-bg-surface border text-fg placeholder:text-fg-dim text-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface',
            'hover-solid',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            error ? 'border-error' : 'border-line'
          )}
        />
        {error && <p id={`${name}-error`} className="mt-1.5 text-xs text-error" role="alert">{error}</p>}
        {helperText && !error && <p id={`${name}-helper`} className="mt-1.5 text-xs text-fg-dim">{helperText}</p>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';