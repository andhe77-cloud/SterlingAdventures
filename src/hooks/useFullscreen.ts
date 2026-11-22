import { useCallback, useEffect, useState } from 'react';

interface FullscreenDoc extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenEnabled?: boolean;
}

interface FullscreenElem extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isSupported =
    typeof document !== 'undefined' &&
    Boolean(
      document.fullscreenEnabled ||
        (document as FullscreenDoc).webkitFullscreenEnabled ||
        (document.documentElement as FullscreenElem).requestFullscreen ||
        (document.documentElement as FullscreenElem).webkitRequestFullscreen
    );

  useEffect(() => {
    const syncState = () => {
      const doc = document as FullscreenDoc;
      setIsFullscreen(Boolean(document.fullscreenElement || doc.webkitFullscreenElement));
    };

    syncState();
    document.addEventListener('fullscreenchange', syncState);
    document.addEventListener('webkitfullscreenchange', syncState);
    return () => {
      document.removeEventListener('fullscreenchange', syncState);
      document.removeEventListener('webkitfullscreenchange', syncState);
    };
  }, []);

  const enterFullscreen = useCallback(async (): Promise<boolean> => {
    const el = document.documentElement as FullscreenElem;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: 'hide' } as FullscreenOptions);
        return true;
      }
      if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, []);

  const exitFullscreen = useCallback(async (): Promise<boolean> => {
    const doc = document as FullscreenDoc;
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        await document.exitFullscreen();
        return true;
      }
      if (doc.webkitExitFullscreen && doc.webkitFullscreenElement) {
        await doc.webkitExitFullscreen();
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, []);

  const toggleFullscreen = useCallback(async (): Promise<boolean> => {
    if (isFullscreen) {
      return exitFullscreen();
    }
    return enterFullscreen();
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    isSupported,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
