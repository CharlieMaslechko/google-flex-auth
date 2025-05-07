import { useEffect, useState } from 'react';
import { ScriptLoadError } from '../errors';

export interface UseLoadIdentityScriptOptions {
  nonce?: string;
  onScriptLoadSuccess?: () => void;
  onScriptLoadError?: (error: ScriptLoadError) => void;
}

export default function useLoadIdentityScript({
  nonce,
  onScriptLoadSuccess,
  onScriptLoadError,
}: UseLoadIdentityScriptOptions = {}): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.google?.accounts?.id) {
      setLoaded(true);
      onScriptLoadSuccess?.();
      return;
    }

    const scriptId = 'google-identity-services';
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.addEventListener('load', () => setLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = scriptId;
    if (nonce) script.nonce = nonce;

    script.onload = () => {
      setLoaded(true);
      onScriptLoadSuccess?.();
    };

    script.onerror = () => {
      const err = new ScriptLoadError();
      onScriptLoadError?.(err);
    };

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [nonce, onScriptLoadSuccess, onScriptLoadError]);

  return loaded;
}
