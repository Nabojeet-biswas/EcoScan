import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface AvatarPickerProps {
  value: string;
  onChange: (avatar: string) => void;
  label?: string;
  helperText?: string;
  options?: string[];
}

export function AvatarPicker({ value, onChange, label = 'Avatar', helperText, options = ['🌱', '🌿', '🍃', '🌲', '♻️', '🗂️', '📦', '🌍'] }: AvatarPickerProps) {
  return (
    <div className="w-full">
      <label className="block">
        <span className="font-medium text-fg">{label}</span>
        {helperText && <span className="text-fg-dim text-xs mt-0.5 block">{helperText}</span>}
      </label>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((avatar) => (
          <button
            key={avatar}
            type="button"
            role="radio"
            aria-checked={value === avatar}
            onClick={() => onChange(avatar)}
            className={clsx(
              'flex items-center justify-center w-12 h-12 rounded-xl text-2xl transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface',
              'hover-solid',
              value === avatar
                ? 'bg-brand text-white border-2 border-brand'
                : 'bg-bg-surface border border-line'
            )}
          >
            {value === avatar && <Check className="w-5 h-5 text-white" aria-hidden="true" />}
            <span aria-hidden="true">{avatar}</span>
          </button>
        ))}
      </div>
    </div>
  );
}