import { Save, X } from 'lucide-react';

interface UnsavedBarProps {
  onSave: () => void;
  onDiscard: () => void;
  isSaving?: boolean;
}

export function UnsavedBar({ onSave, onDiscard, isSaving = false }: UnsavedBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface border-t border-line shadow-lg animate-slide-up p-4 safe-bottom">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-medium text-fg">You have unsaved changes</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onDiscard}
            className="px-4 py-2 rounded-xl text-sm font-medium hover-solid text-fg"
          >
            <X className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Discard
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-brand text-white hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving…' : 'Save'}
            <Save className="w-4 h-4 ml-1.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}