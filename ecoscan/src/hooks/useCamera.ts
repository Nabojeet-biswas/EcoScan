import { useState, useCallback, useRef, useEffect } from 'react';

interface UseCameraReturn {
  startCamera: (facingMode?: 'user' | 'environment') => Promise<MediaStream>;
  stopCamera: () => void;
  switchCamera: (facingMode: 'user' | 'environment') => Promise<void>;
  hasCamera: boolean;
  stream: MediaStream | null;
  error: string | null;
}

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const facingModeRef = useRef<'user' | 'environment'>('environment');
  const streamRef = useRef<MediaStream | null>(null);

  const checkCameraAvailability = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      setHasCamera(videoDevices.length > 0);
      return videoDevices.length > 0;
    } catch {
      setHasCamera(false);
      return false;
    }
  }, []);

  useEffect(() => {
    checkCameraAvailability();
  }, [checkCameraAvailability]);

  const startCamera = useCallback(async (facingMode: 'user' | 'environment' = 'environment'): Promise<MediaStream> => {
    facingModeRef.current = facingMode;
    setError(null);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasCamera(true);
      return mediaStream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Camera access denied';
      setError(errorMessage);
      setHasCamera(false);
      throw err;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const switchCamera = useCallback(async (facingMode: 'user' | 'environment') => {
    await startCamera(facingMode);
  }, [startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    startCamera,
    stopCamera,
    switchCamera,
    hasCamera,
    stream,
    error,
  };
}