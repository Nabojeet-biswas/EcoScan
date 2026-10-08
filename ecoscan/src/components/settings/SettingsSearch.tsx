import { clsx } from 'clsx';
import { Search, X } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface SettingsSearchHandle {
  focus: () => void;
}

interface SettingsSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  results: Array<{ section: string; key: string; label: string; description: string }>;
  showResults: boolean;
  onResultClick: (sectionKey: string) => void;
}

export const SettingsSearch = forwardRef<SettingsSearchHandle, SettingsSearchProps>(
  ({ value, onChange, onFocus, onBlur, results, showResults, onResultClick }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }), []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        onResultClick(results[0].key);
      }
    };

    return (
      <div className="relative">
        <label htmlFor="settings-search" className="sr-only">
          Search settings
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-dim pointer-events-none" aria-hidden="true" />
          <input
            ref={inputRef}
            id="settings-search"
            type="search"
            value={value}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search settings… (press / to focus)"
            className={clsx(
              'w-full pl-10 pr-10 py-2 rounded-xl bg-bg-surface border border-line text-fg placeholder:text-fg-dim text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface',
              'transition-colors duration-150'
            )}
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-fg-dim hover-solid"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {showResults && results.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-line rounded-xl shadow-lg overflow-hidden z-10 max-h-60 overflow-y-auto" role="listbox">
            {results.map((result) => (
              <li key={result.key} role="option">
                <button
                  type="button"
                  onClick={() => onResultClick(result.key)}
                  className={clsx(
                    'w-full px-3 py-2.5 text-left text-sm flex items-center gap-3',
                    'hover-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface'
                  )}
                >
                  <span className="flex-1">
                    <span className="font-medium text-fg truncate block">{result.label}</span>
                    <span className="text-fg-dim text-xs truncate block">{result.description}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

SettingsSearch.displayName = 'SettingsSearch';