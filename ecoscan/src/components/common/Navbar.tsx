import { motion } from "framer-motion";
import { Leaf, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { clsx } from "clsx";
import { useSidebar } from "@/context/SidebarContext";
import { useNavbarConfig } from "@/context/NavbarContext";
import { HamburgerButton } from "@/components/HamburgerButton";

export function Navbar() {
  const { config } = useNavbarConfig();
  const { isOpen, toggle } = useSidebar();

  const onScanClick = config?.onScanClick ?? (() => {});
  const onHomeClick = config?.onHomeClick ?? onScanClick;
  const ecoPoints = config?.ecoPoints ?? 0;
  const showPoints = config?.showPoints ?? false;
  const onHistoryClick = config?.onHistoryClick;
  const isScannerPage = config?.isScannerPage ?? false;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className={clsx(
        "transition-all duration-300",
        isScannerPage
          ? "bg-bg/95 backdrop-blur-xl border-b border-line-strong"
          : "bg-transparent"
      )}
    >
      <nav className="section-container" aria-label="Page navigation">
        <div className="flex items-center justify-between h-14 gap-2 sm:h-16 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 cursor-pointer sm:gap-3 hover-solid"
            onClick={onHomeClick}
          >
            <HamburgerButton isOpen={isOpen} onClick={toggle} aria-controls="sidebar-drawer" />
            <Logo size={28} variant="symbol" />
            <div className="min-w-0">
              <span className="font-display font-bold text-lg text-fg sm:text-xl">EcoScan</span>
              <p className="hidden text-fg-dim text-xs uppercase tracking-wider sm:block">AI Waste Intelligence</p>
            </div>
          </motion.div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {showPoints && ecoPoints !== undefined && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-full glass sm:gap-2 sm:px-3"
              >
                <Leaf className="w-4 h-4 text-brand" />
                <span className="font-mono font-semibold text-fg tabular-nums">{ecoPoints}</span>
                <span className="hidden text-fg-dim text-xs sm:inline">ECO</span>
              </motion.div>
            )}

            {onHistoryClick && (
              <button
                onClick={onHistoryClick}
                className="p-2 rounded-xl glass text-fg-muted hover-solid"
                aria-label="Scan history"
              >
                <History className="w-5 h-5" />
              </button>
            )}

            {isScannerPage && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="primary"
                  size="md"
                  onClick={onScanClick}
                >
                  <span className="sm:hidden">Scan</span>
                  <span className="hidden sm:inline">Start Scanning</span>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}