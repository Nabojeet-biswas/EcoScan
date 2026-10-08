import { forwardRef } from 'react';

interface SliderFieldProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  helperText?: string;
  disabled?: boolean;
  'aria-label'?: string;
  valueLabel?: (value: number) => string;
}

export const SliderField = forwardRef<HTMLDivElement, SliderFieldProps>(
  ({ value, onChange, min, max, step, label, helperText, disabled = false, 'aria-label': ariaLabel, valueLabel }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        const newValue = Number(e.target.value);
        onChange(newValue);
      }
    };

    return (
      <div className="w-full" role="slider" aria-label={ariaLabel ?? label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-disabled={disabled}>
        <label className="block">
          <div className="flex items-center justify-between">
            <span className="font-medium text-fg">{label}</span>
            <span className="text-fg-dim text-sm font-mono tabular-nums">{valueLabel ? valueLabel(value) : value}</span>
          </div>
          {helperText && <span className="text-fg-dim text-xs mt-0.5 block">{helperText}</span>}
        </label>
        <div className="mt-2 relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            aria-label={ariaLabel ?? label}
            className="w-full h-2 bg-bg-surface rounded-full appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            style={{
              background: `linear-gradient(to right, var(--color-accent-dark) ${percentage}%, var(--color-border) ${percentage}%)`,
            }}
          />
        </div>
      </div>
    );
  }
);

SliderField.displayName = 'SliderField';