import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  RotateCcw,
  Image,
  X,
  Sparkles,
  Zap,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GlassCard, ScanLine, CornerMarkers } from "@/components/common/GlassCard";
import { Logo } from "@/components/common/Logo";
import { DetectionOverlay } from "./DetectionOverlay";
import { ScanStatus } from "./ScanStatus";
import { useCamera } from "@/features/scanner/hooks/useCamera";
import {
  detectionService,
} from "@/features/waste/services/detectionService";
import type { WasteDetection } from "@/features/waste/types";

interface CameraViewProps {
  onDetection: (detection: WasteDetection) => void;
  onError: (error: string) => void;
  isScanning: boolean;
  isAnalyzing: boolean;
  currentDetection: WasteDetection | null;
  demoMode: boolean;
  onDemoSelect: (id: string) => void;
}

export function CameraView({
  onDetection,
  onError,
  isScanning,
  isAnalyzing,
  currentDetection,
  demoMode,
  onDemoSelect,
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [facingMode] = useState<"environment" | "user">("environment");
  const [showDemoSelector, setShowDemoSelector] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const { startCamera, stopCamera, switchCamera, hasCamera } = useCamera();
  const demoObjects = detectionService.getDemoObjects();

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    return dataUrl.split(",")[1];
  }, []);

  const handleScan = async () => {
    if (demoMode) {
      setShowDemoSelector(true);
      return;
    }

    if (!stream) {
      onError("Camera not available");
      return;
    }

    setScanProgress(0);
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    const imageData = captureFrame();
    if (!imageData) {
      clearInterval(progressInterval);
      setScanProgress(0);
      onError("Failed to capture image");
      return;
    }

    try {
      const result = await detectionService.detectFromImage(imageData);
      clearInterval(progressInterval);
      setScanProgress(100);
      if (result.success && result.detection) {
        if (result.mode === "demo" && !demoMode) {
          toast.custom(
            () => (
              <GlassCard
                variant="elevated"
                className="w-[calc(100vw-2rem)] max-w-[20rem] border-amber-primary/20 bg-amber-primary/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-primary/10 border border-amber-primary/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle
                      className="w-5 h-5 text-amber-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-amber-primary text-sm">
                      AI Temporarily Unavailable
                    </p>
                    <p className="text-fg-muted text-xs mt-1">
                      Using demo detection.
                    </p>
                  </div>
                </div>
              </GlassCard>
            ),
            {
              duration: 4000,
              position: "bottom-center",
              style: { marginBottom: "80px" },
            },
          );
        }
        onDetection(result.detection);
      } else {
        setScanProgress(0);
        onError(result.error || "Detection failed");
      }
    } catch (err) {
      clearInterval(progressInterval);
      setScanProgress(0);
      onError("Detection error occurred");
    }
  };

  const handleDemoSelect = (id: string) => {
    setShowDemoSelector(false);
    onDemoSelect(id);
  };

  useEffect(() => {
    let mounted = true;
    const initCamera = async () => {
      try {
        const mediaStream = await startCamera(facingMode);
        if (mounted) {
          setStream(mediaStream);
          setPermissionState("granted");
        }
      } catch (err) {
        if (mounted) {
          setPermissionState("denied");
          if (!demoMode) {
            onError(
              "Camera access denied. Enable camera permissions or use Demo Mode.",
            );
          }
        }
      }
    };

    if (!demoMode) {
      initCamera();
    }

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [demoMode, facingMode, startCamera, stopCamera, onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch(console.error);
    }
    return () => {
      if (video) video.srcObject = null;
    };
  }, [stream]);

  const renderDemoMode = () => (
    <div className="relative flex h-[70svh] min-h-[30rem] max-h-[48rem] w-full flex-col overflow-hidden rounded-[22px] bg-scanner-bg sm:h-[calc(100svh-5rem)] lg:h-[calc(100svh-6rem)] lg:max-h-none">
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-brand-light/5"
        aria-hidden="true"
      />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <Badge variant="warning" size="sm" dot>
          DEMO MODE
        </Badge>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center p-3 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-[42rem]"
        >
          <GlassCard variant="elevated" className="p-4 text-center sm:p-8 lg:p-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="w-24 h-24 rounded-[20px] bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="w-12 h-12 text-brand" aria-hidden="true" />
            </motion.div>

            <h3 className="mb-3 font-display text-2xl font-normal text-fg sm:text-3xl lg:text-4xl">
              Demo Mode Active
            </h3>
            <p className="mx-auto mb-10 max-w-[28rem] text-lg leading-relaxed text-fg-muted">
              Select a sample waste object to simulate the scanning experience.
              No camera required.
            </p>

            <Button
              size="xl"
              onClick={() => setShowDemoSelector(true)}
              leftIcon={<Image className="w-5 h-5" />}
              rightIcon={<Sparkles className="w-5 h-5" />}
              className="mx-auto mb-4 w-full max-w-[20rem]"
            >
              Try Demo Object
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowDemoSelector(true)}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="mx-auto w-full max-w-[20rem]"
            >
              Simulate Random Scan
            </Button>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-fg-dim text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand" aria-hidden="true" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-light" aria-hidden="true" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles
                  className="w-4 h-4 text-amber-primary"
                  aria-hidden="true"
                />
                <span>9+ Waste Types</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <Dialog open={showDemoSelector} onOpenChange={setShowDemoSelector}>
        <DialogContent
          aria-labelledby="demo-title"
          showCloseButton={false}
          className="max-h-[85svh] w-[calc(100%-1.5rem)] max-w-[42rem] gap-0 overflow-y-auto rounded-[22px] border border-line bg-bg-surface p-4 text-fg ring-0 sm:w-full sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <DialogTitle
              id="demo-title"
              className="font-display text-2xl font-normal text-fg"
            >
              Select Demo Object
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDemoSelector(false)}
              aria-label="Close demo selector"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {demoObjects.map((obj) => (
              <motion.button
                key={obj.id}
                onClick={() => handleDemoSelect(obj.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group p-4 rounded-xl bg-bg-elevated/50 border border-line hover:border-brand/30 hover:bg-bg-surface/50 transition-all text-left"
              >
                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                  {obj.icon}
                </div>
                <div className="font-medium text-fg mb-2">{obj.name}</div>
                <Badge
                  variant={
                    obj.category === "special"
                      ? "warning"
                      : obj.category === "recyclable"
                        ? "success"
                        : obj.category === "organic"
                          ? "info"
                          : "danger"
                  }
                  size="sm"
                >
                  {obj.category}
                </Badge>
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <Button
          variant="primary"
          size="xl"
          onClick={handleScan}
          disabled={isScanning || isAnalyzing}
          isLoading={isScanning || isAnalyzing}
          leftIcon={<Camera className="w-5 h-5" />}
          rightIcon={
            isAnalyzing ? (
              <Sparkles className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )
          }
          className="w-16 h-16 rounded-full p-0 shadow-[0_0_30px_rgba(63,125,88,0.3)] hover:shadow-[0_0_50px_rgba(63,125,88,0.4)] flex items-center justify-center min-h-[60px]"
        >
          {isAnalyzing ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-xs"
            >
              AI
            </motion.span>
          ) : isScanning ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-xs"
            >
              SCAN
            </motion.span>
          ) : (
            <span className="text-xs font-medium">SCAN</span>
          )}
        </Button>
      </div>
    </div>
  );

  const renderPermissionDenied = () => (
    <div className="relative flex h-[70svh] min-h-[30rem] max-h-[48rem] w-full items-center justify-center overflow-hidden rounded-[22px] bg-scanner-bg sm:h-[calc(100svh-5rem)] lg:h-[calc(100svh-6rem)] lg:max-h-none">
      <div
        className="absolute inset-0 bg-gradient-to-br from-red-primary/5 via-transparent to-transparent"
        aria-hidden="true"
      />
      <GlassCard
        variant="elevated"
        className="relative z-10 mx-3 w-full max-w-[28rem] p-4 text-center sm:mx-4 sm:p-8"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="w-16 h-16 rounded-xl bg-red-primary/10 border border-red-primary/20 flex items-center justify-center mx-auto mb-4"
        >
          <Camera className="w-8 h-8 text-red-primary" aria-hidden="true" />
        </motion.div>
        <h3 className="font-display text-2xl font-normal text-fg mb-2">
          Camera Access Required
        </h3>
        <p className="text-fg-muted text-base mb-6 leading-relaxed">
          Camera access is required to scan waste. Please enable camera
          permissions in your browser settings.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => window.location.reload()}
            leftIcon={<RotateCcw className="w-5 h-5" />}
          >
            Retry Camera
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowDemoSelector(true)}
            leftIcon={<Image className="w-5 h-5" />}
          >
            Use Demo Mode
          </Button>
        </div>
      </GlassCard>
    </div>
  );

  if (demoMode) return renderDemoMode();
  if (permissionState === "denied" || !hasCamera)
    return renderPermissionDenied();

  return (
    <div className="relative flex h-[70svh] min-h-[30rem] max-h-[48rem] w-full flex-col overflow-hidden rounded-[22px] bg-scanner-bg sm:h-[calc(100svh-5rem)] lg:h-[calc(100svh-6rem)] lg:max-h-none">
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-brand-light/5"
        aria-hidden="true"
      />

      <video
        ref={videoRef}
        className="w-full h-full object-cover flex-1"
        playsInline
        muted
        aria-hidden="true"
      />
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="absolute inset-0 pointer-events-none flex flex-col">
        <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-brand" aria-hidden="true" />
            </motion.div>
            <Logo size={28} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Badge
              variant={demoMode ? "warning" : "success"}
              size="sm"
              dot
              className="hidden sm:inline-flex"
            >
              {demoMode ? "DEMO MODE" : "ACTIVE"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                switchCamera(
                  facingMode === "environment" ? "user" : "environment",
                )
              }
              aria-label="Switch camera"
              className="hidden sm:flex"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative aspect-square w-[78%] max-w-[400px]">
            <CornerMarkers color="green" animated size="lg" />
            <ScanLine
              color="green"
              speed={isScanning || isAnalyzing ? 1.8 : 3.5}
            />

            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-center">
              <motion.p
                key={isAnalyzing ? "analyzing" : "scanning"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-xs text-fg/50 uppercase tracking-widest font-medium"
              >
                {isAnalyzing ? "ANALYZING OBJECT..." : "SCAN YOUR WASTE"}
              </motion.p>
            </div>

            <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 text-center">
              <ScanStatus
                status={
                  isAnalyzing ? "detecting" : isScanning ? "scanning" : "idle"
                }
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 pb-3 sm:bottom-6 sm:gap-4 sm:pb-4 lg:bottom-8 lg:pb-6">
          <Button
            variant="primary"
            size="xl"
            onClick={handleScan}
            disabled={isScanning || isAnalyzing}
            isLoading={isScanning || isAnalyzing}
            leftIcon={<Camera className="w-5 h-5" />}
            rightIcon={
              isAnalyzing ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )
            }
            className="w-16 h-16 rounded-full p-0 shadow-[0_0_30px_rgba(63,125,88,0.3)] hover:shadow-[0_0_50px_rgba(63,125,88,0.4)] flex items-center justify-center min-h-[60px]"
          >
            {isAnalyzing ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xs"
              >
                AI
              </motion.span>
            ) : isScanning ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xs"
              >
                SCAN
              </motion.span>
            ) : (
              <span className="text-xs font-medium">SCAN</span>
            )}
          </Button>

          {(demoMode || !hasCamera) && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowDemoSelector(true)}
              leftIcon={<Image className="w-4 h-4" />}
              className="min-h-[44px]"
            >
              Try Demo Object
            </Button>
          )}

          {(isScanning || isAnalyzing) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-56 bg-bg-elevated/80 backdrop-blur-sm rounded-full h-1.5 border border-line overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light"
                style={{ boxShadow: "0 0 16px rgba(63, 125, 88, 0.4)" }}
              />
            </motion.div>
          )}
        </div>
      </div>

      <DetectionOverlay
        detection={currentDetection}
        isVisible={!!currentDetection}
      />

      <div className="safe-bottom" aria-hidden="true" />

      <Dialog open={showDemoSelector} onOpenChange={setShowDemoSelector}>
        <DialogContent
          aria-labelledby="demo-title"
          showCloseButton={false}
          className="max-h-[85svh] w-[calc(100%-1.5rem)] max-w-[42rem] gap-0 overflow-y-auto rounded-[22px] border border-line bg-bg-surface p-4 text-fg ring-0 sm:w-full sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <DialogTitle
              id="demo-title"
              className="font-display text-2xl font-normal text-fg"
            >
              Select Demo Object
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDemoSelector(false)}
              aria-label="Close demo selector"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {demoObjects.map((obj) => (
              <motion.button
                key={obj.id}
                onClick={() => handleDemoSelect(obj.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group p-4 rounded-xl bg-bg-elevated/50 border border-line hover:border-brand/30 hover:bg-bg-surface/50 transition-all text-left"
              >
                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                  {obj.icon}
                </div>
                <div className="font-medium text-fg mb-2">{obj.name}</div>
                <Badge
                  variant={
                    obj.category === "special"
                      ? "warning"
                      : obj.category === "recyclable"
                        ? "success"
                        : obj.category === "organic"
                          ? "info"
                          : "danger"
                  }
                  size="sm"
                >
                  {obj.category}
                </Badge>
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
