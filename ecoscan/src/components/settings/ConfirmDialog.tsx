import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger' }: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      dialogRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: { border: 'var(--color-error)', bg: 'var(--color-error)', hoverBg: 'var(--color-error)', text: 'white' },
    warning: { border: 'var(--color-amber-primary)', bg: 'var(--color-amber-primary)', hoverBg: 'var(--color-amber-primary)', text: 'white' },
    info: { border: 'var(--color-brand)', bg: 'var(--color-brand)', hoverBg: 'var(--color-brand)', text: 'white' },
  } as const;

  const style = variantStyles[variant];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-md bg-bg-surface border rounded-2xl p-6 shadow-lg animate-scale-in"
        style={{ borderColor: style.border }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-fg-dim hover-solid"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="space-y-4">
          <h2 id="confirm-title" className="font-display text-xl font-normal text-fg">{title}</h2>
          <p id="confirm-description" className="text-fg-muted">{description}</p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium hover-solid text-fg"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => { onConfirm(); onClose(); }}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                backgroundColor: style.bg,
                color: style.text,
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}