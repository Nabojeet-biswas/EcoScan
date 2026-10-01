import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { GlassCard, Button, Badge, SplashScreen } from '../components/common/GlassCard';
import { Navbar } from '../components/common/Navbar';
import { CameraView } from '../components/scanner/CameraView';
import { ScanStatus } from '../components/scanner/ScanStatus';
import { WasteInfoPanel } from '../components/waste/WasteInfoPanel';
import { WasteObject } from '../components/waste/WasteObject';
import { RecyclingBins } from '../components/bins/RecyclingBins';
import { SuccessAnimation } from '../components/feedback/SuccessAnimation';
import { EnvironmentalImpactCard } from '../components/EnvironmentalImpactCard';
import { HeroSection } from '../components/HeroSection';
import { ScrollAnimation } from '../components/common/ScrollAnimation';
import { detectionService, type WasteDetection } from '../services/detectionService';
import { getBinForWaste } from '../utils/wasteRules';

type ScannerState = 
  | 'landing'
  | 'idle' 
  | 'scanning' 
  | 'detecting' 
  | 'detected' 
  | 'showing_details' 
  | 'sorting' 
  | 'success' 
  | 'error';

const INITIAL_POINTS = 120;
const POINTS_PER_CORRECT = 10;

export function ScannerPage() {
  const [state, setState] = useState<ScannerState>('landing');
  const [currentDetection, setCurrentDetection] = useState<WasteDetection | null>(null);
  const [ecoPoints, setEcoPoints] = useState(() => {
    const saved = localStorage.getItem('ecoscan_points');
    return saved ? parseInt(saved, 10) : INITIAL_POINTS;
  });
  const [scanHistory, setScanHistory] = useState<Array<{ detection: WasteDetection; correct: boolean; timestamp: number }>>(() => {
    const saved = localStorage.getItem('ecoscan_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [demoMode, setDemoMode] = useState(!detectionService.getApiKey());
  const [error, setError] = useState<string | null>(null);
  const [selectedBin, setSelectedBin] = useState<'recyclable' | 'organic' | 'non-recyclable' | 'special' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultCorrect, setResultCorrect] = useState<boolean | null>(null);
  const [binRects, setBinRects] = useState<Map<string, DOMRect>>(new Map());
  const binRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const [showSplash, setShowSplash] = useState(true);
  
  const mode = detectionService.getMode();

  useEffect(() => {
    const unsubscribe = detectionService.subscribe((newMode: 'ai' | 'demo') => {
      setDemoMode(newMode === 'demo');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    localStorage.setItem('ecoscan_points', ecoPoints.toString());
  }, [ecoPoints]);

  useEffect(() => {
    localStorage.setItem('ecoscan_history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    const updateRects = () => {
      const newRects = new Map<string, DOMRect>();
      binRefs.current.forEach((el, key) => {
        if (el) newRects.set(key, el.getBoundingClientRect());
      });
      setBinRects(newRects);
    };
    
    const observer = new ResizeObserver(updateRects);
    binRefs.current.forEach(el => { if (el) observer.observe(el); });
    updateRects();
    
    return () => observer.disconnect();
  }, []);

  const correctBin = currentDetection ? getBinForWaste(currentDetection.name) : 'non-recyclable';

  const handleStartScanning = useCallback(() => {
    setState('idle');
  }, []);

  const handleScan = useCallback(async () => {
    if (state !== 'idle' && state !== 'detected' && state !== 'success') return;
    setState('scanning');
    setError(null);
  }, [state]);

  const handleDetection = useCallback((detection: WasteDetection) => {
    setCurrentDetection(detection);
    setState('detecting');
    
    setTimeout(() => {
      setState('detected');
      setTimeout(() => setState('showing_details'), 300);
    }, 500);
  }, []);

  const handleDemoSelect = useCallback((id: string) => {
    const result = detectionService.getDemoDetection(id);
    if (result.success && result.detection) {
      handleDetection(result.detection);
    }
  }, [handleDetection]);

  const handleError = useCallback((err: string) => {
    setError(err);
    setState('error');
  }, []);

  const handleCloseDetails = useCallback(() => {
    setState('idle');
    setCurrentDetection(null);
    setSelectedBin(null);
    setShowResult(false);
    setResultCorrect(null);
  }, []);

  const handleBinSelect = useCallback((binType: 'recyclable' | 'organic' | 'non-recyclable' | 'special' | null) => {
    if (!currentDetection || !binType) return;
    
    setSelectedBin(binType);
    setState('sorting');
    
    setTimeout(() => {
      const isCorrect = binType === correctBin;
      setResultCorrect(isCorrect);
      setShowResult(true);
      
      if (isCorrect) {
        const newPoints = ecoPoints + POINTS_PER_CORRECT;
        setEcoPoints(newPoints);
        setScanHistory(prev => [{
          detection: currentDetection,
          correct: true,
          timestamp: Date.now()
        }, ...prev.slice(0, 9)]);
        
        setTimeout(() => {
          setState('success');
        }, 500);
      } else {
        setState('showing_details');
        setSelectedBin(null);
      }
    }, 800);
  }, [currentDetection, correctBin, ecoPoints]);

  const handleRetry = useCallback(() => {
    setSelectedBin(null);
    setShowResult(false);
    setResultCorrect(null);
    setState('showing_details');
  }, []);

  const handleContinue = useCallback(() => {
    setState('idle');
    setCurrentDetection(null);
    setSelectedBin(null);
    setShowResult(false);
    setResultCorrect(null);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isScanning = state === 'scanning' || state === 'detecting';
  const isAnalyzing = state === 'detecting';

return (
    <div className="min-h-screen bg-bg text-fg">
      <SplashScreen onComplete={() => setShowSplash(false)} />
      
      {!showSplash && (
        <div>
          <Navbar 
            onScanClick={handleStartScanning}
            ecoPoints={ecoPoints}
            showPoints={state !== 'landing'}
            onHistoryClick={() => setShowHistory(true)}
            isScannerPage={state !== 'landing'}
          />
          
          {state === 'landing' && (
            <HeroSection onScanClick={handleStartScanning} mode={mode} />
          )}

          {state !== 'landing' && (
            <>
              <motion.section
                id="scanner"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative pt-20 pb-4 px-4"
              >
                <div className="section-container">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <ScrollAnimation animation="fade-in-up" delay={0}>
                        <CameraView
                          onDetection={handleDetection}
                          onError={handleError}
                          isScanning={isScanning}
                          isAnalyzing={isAnalyzing}
                          currentDetection={currentDetection}
                          demoMode={demoMode}
                          onDemoSelect={handleDemoSelect}
                        />
                      </ScrollAnimation>
                    </div>
                    
                    <div className="lg:col-span-1 flex flex-col gap-4">
                      <ScrollAnimation animation="fade-in-up" delay={100}>
                        <GlassCard variant="elevated" className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Scan Status</h2>
                            <Badge variant={mode === 'ai' ? 'success' : 'warning'} size="sm" dot>
                              {mode === 'ai' ? 'ACTIVE' : 'DEMO MODE'}
                            </Badge>
                          </div>
                          <ScanStatus status={isScanning ? 'scanning' : isAnalyzing ? 'detecting' : 'idle'} />
                          
                          <div className="mt-6 pt-4 border-t border-line space-y-3">
                            <p className="text-fg-muted text-sm">Point waste at camera and tap Scan</p>
                            {demoMode && (
                              <Button variant="secondary" className="w-full" onClick={handleScan} leftIcon={<Sparkles className="w-4 h-4" />}>
                                Try Demo Object
                              </Button>
                            )}
                          </div>
</GlassCard>
                      </ScrollAnimation>

                      <ScrollAnimation animation="fade-in-up" delay={200}>
                          <GlassCard variant="subtle" className="p-5">
                            <h3 className="font-semibold mb-3">How It Works</h3>
                            <ol className="space-y-2 text-fg-muted text-sm">
                              <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center font-medium">1</span>Point camera at waste</li>
                              <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center font-medium">2</span>AI identifies material</li>
                              <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center font-medium">3</span>Drag to correct bin</li>
                              <li className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center font-medium">4</span>Earn Eco Points!</li>
                            </ol>
                          </GlassCard>
                        </ScrollAnimation>
                      </div>
                    </div>
                  </div>
                </motion.section>

              <AnimatePresence>
                {currentDetection && (state === 'showing_details' || state === 'sorting' || state === 'success') && (
                  <WasteInfoPanel
                    detection={currentDetection}
                    onClose={handleCloseDetails}
                    onSort={handleBinSelect}
                    isMobile={isMobile}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {(state === 'showing_details' || state === 'sorting' || state === 'success') && currentDetection && !currentDetection.boundingBox && (
                  <WasteObject
                    detection={currentDetection}
                    onDragEnd={handleBinSelect}
                    bins={Array.from(binRects.entries()).map(([type, rect]) => ({ type: type as any, rect }))}
                    isSorting={state === 'sorting'}
                    selectedBin={selectedBin}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {(state === 'showing_details' || state === 'sorting') && currentDetection && !currentDetection.category.includes('special') && (
                  <RecyclingBins
                    detection={currentDetection}
                    onBinSelect={handleBinSelect}
                    selectedBin={selectedBin}
                    isSorting={state === 'sorting'}
                    binRefs={binRefs}
                    correctBin={correctBin}
                    showResult={showResult}
                    resultCorrect={resultCorrect}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {state === 'success' && currentDetection && (
                  <SuccessAnimation
                    detection={currentDetection}
                    isCorrect={resultCorrect === true}
                    pointsEarned={resultCorrect ? POINTS_PER_CORRECT : 0}
                    onContinue={handleContinue}
                    onRetry={handleRetry}
                  />
                )}
              </AnimatePresence>

              {currentDetection && (state === 'showing_details' || state === 'sorting' || state === 'success') && (
                <motion.section
                  id="environmental-impact"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative pt-4 pb-16 px-4"
                >
                  <div className="section-container">
                    <EnvironmentalImpactCard detection={currentDetection} />
                  </div>
                </motion.section>
              )}

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm"
                    onClick={() => setShowHistory(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="history-title"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 50 : 0 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 50 : 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      className={clsx(
                        'flex flex-col max-h-[90vh]',
                        isMobile
                          ? 'fixed bottom-0 left-0 right-0 rounded-t-3xl bg-bg-elevated'
                          : 'fixed right-4 top-20 bottom-20 w-80 lg:w-96 bg-bg-surface rounded-3xl border border-line-strong'
                      )}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between p-4 border-b border-line">
                        <h2 id="history-title" className="font-display text-heading-md">Scan History</h2>
                        <motion.button
                          onClick={() => setShowHistory(false)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-xl hover:bg-fg/10 text-fg-muted"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {scanHistory.length === 0 ? (
                          <div className="p-12 text-center text-fg-muted">
                            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="text-body-md">No scans yet. Start scanning!</p>
                          </div>
                        ) : (
                          <ul className="divide-y divide-line">
                            {scanHistory.map((item, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 flex items-center gap-3 hover:bg-fg/5"
                              >
                                <div className="w-12 h-12 rounded-xl bg-fg/5 flex items-center justify-center text-2xl flex-shrink-0">
                                  {['🥤', '♻️', '🍌', '📄', '🍾', '🥗', '🛍️', '🔋', '📦'][index % 9]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{item.detection.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium',
                                      item.detection.category === 'organic' && 'bg-green-primary/20 text-green-light dark:bg-green-primary/20 dark:text-green-light',
                                      item.detection.category === 'recyclable' && 'bg-blue-primary/20 text-blue-light dark:bg-blue-primary/20 dark:text-blue-light',
                                      item.detection.category === 'non-recyclable' && 'bg-red-primary/20 text-red-light dark:bg-red-primary/20 dark:text-red-light',
                                      item.detection.category === 'special' && 'bg-amber-primary/20 text-amber-light dark:bg-amber-primary/20 dark:text-amber-light'
                                    )}>
                                      {item.detection.category === 'special' ? (
                                        <>⚠ Special Handling</>
                                      ) : (
                                        item.detection.category.charAt(0).toUpperCase() + item.detection.category.slice(1)
                                      )}
                                    </span>
                                    <span className="text-fg-dim text-xs">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                </div>
                                <Badge variant={item.correct ? 'success' : 'danger'} size="sm" dot>
                                  {item.correct ? 'Correct' : 'Incorrect'}
                                </Badge>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {scanHistory.length > 0 && (
                        <motion.button
                          onClick={() => {
                            setScanHistory([]);
                            localStorage.removeItem('ecoscan_history');
                          }}
                          whileHover={{ color: '#EF4444' }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-3 text-fg-muted hover:text-red-primary text-sm font-medium border-t border-line safe-bottom"
                        >
                          Clear History
                        </motion.button>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md"
                  >
                    <GlassCard variant="elevated" className="p-4 border-red-primary/30 bg-red-primary/10">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-red-primary/20 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-red-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-red-primary">Error</p>
                          <p className="text-fg-muted text-sm mt-1">{error}</p>
                        </div>
                        <motion.button
                          onClick={() => setError(null)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-fg-muted hover:text-fg"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </GlassCard>
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}