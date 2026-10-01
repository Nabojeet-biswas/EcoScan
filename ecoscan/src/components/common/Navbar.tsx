import { motion } from 'framer-motion';
import { Leaf, History } from 'lucide-react';
import { Button } from './GlassCard';
import { Logo } from './Logo';
import { SettingsMenu } from './SettingsMenu';
import { clsx } from 'clsx';

interface NavbarProps {
  onScanClick: () => void;
  ecoPoints?: number;
  showPoints?: boolean;
  onHistoryClick?: () => void;
  isScannerPage?: boolean;
}

export function Navbar({ onScanClick, ecoPoints = 0, showPoints = false, onHistoryClick, isScannerPage = false }: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScannerPage
          ? 'bg-bg/95 backdrop-blur-xl border-b border-line-strong'
          : 'bg-transparent'
      )}
    >
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={onScanClick}
          >
            <Logo size={32} variant="symbol" />
            <div>
              <span className="font-display font-bold text-xl text-fg">EcoScan</span>
              <p className="text-fg-dim text-xs uppercase tracking-wider">AI Waste Intelligence</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            {showPoints && ecoPoints !== undefined && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass"
              >
                <Leaf className="w-4 h-4 text-brand" />
                <span className="font-mono font-semibold text-fg tabular-nums">{ecoPoints}</span>
                <span className="text-fg-dim text-xs">ECO</span>
              </motion.div>
            )}

            {onHistoryClick && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: isScannerPage ? 0.35 : 0.3 }}
                onClick={onHistoryClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl glass text-fg-muted hover:text-fg hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                aria-label="Scan history"
              >
                <History className="w-5 h-5" />
              </motion.button>
            )}

            <SettingsMenu />

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
                  Start Scanning
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}