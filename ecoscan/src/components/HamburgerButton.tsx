import { clsx } from "clsx";
import { useEffect, useState } from "react";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  "aria-controls"?: string;
}

export function HamburgerButton({ isOpen, onClick, "aria-controls": ariaControls }: HamburgerButtonProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const transitionClass = prefersReducedMotion
    ? ""
    : "transition-transform duration-300 ease-in-out";

  const lineDelay = prefersReducedMotion
    ? ""
    : "transition-delay-[calc(var(--line-index)*60ms)]";

  if (!mounted) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center w-10 h-10 rounded-xl text-fg-dim hover-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
        aria-label="Toggle sidebar"
        aria-expanded={isOpen}
        aria-controls={ariaControls}
      >
        <div className="relative w-5 h-5 flex flex-col items-center justify-center gap-1.5" role="img" aria-hidden="true">
          <span className="block w-[20px] h-[2px] bg-current rounded-full" />
          <span className="block w-[20px] h-[2px] bg-current rounded-full" />
          <span className="block w-[20px] h-[2px] bg-current rounded-full" />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center w-10 h-10 rounded-xl",
        "text-fg-dim hover-solid",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
      )}
      aria-label="Toggle sidebar"
      aria-expanded={isOpen}
      aria-controls={ariaControls}
    >
      <div
        className={clsx(
          "relative w-5 h-5 flex flex-col items-center justify-center gap-1.5",
          transitionClass,
          isOpen ? "rotate-90" : "rotate-0"
        )}
        role="img"
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={clsx(
              "block w-[20px] h-[2px] bg-current rounded-full",
              lineDelay
            )}
            style={{ "--line-index": i } as React.CSSProperties}
          />
        ))}
      </div>
    </button>
  );
}