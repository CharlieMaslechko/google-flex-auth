import { useEffect, useRef, useState } from 'react';
import { useGoogleFlexAuth } from '../core/context/GoogleFlexAuthProvider';
import {
  GoogleAuthError,
  MissingClientIdError,
  ScriptLoadError,
  MissingCredentialError,
} from '../core/errors';

interface UseGoogleFlexOneTapOptions {
  onSuccess: (idToken: string, raw: google.accounts.id.CredentialResponse) => void;
  onPromptStart?: () => void;
  onDismiss?: () => void;
  onError?: (error: GoogleAuthError) => void;
}

interface UseGoogleFlexOneTapReturn {
  isPromptVisible: boolean;
  hasDismissed: boolean;
  error: GoogleAuthError | null;
}

export function useGoogleFlexOneTap({
  onSuccess,
  onPromptStart,
  onDismiss,
  onError,
}: UseGoogleFlexOneTapOptions): UseGoogleFlexOneTapReturn {
  const { clientId, scriptLoaded } = useGoogleFlexAuth();
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [error, setError] = useState<GoogleAuthError | null>(null);

  const hasPromptedRef = useRef(false);

  useEffect(() => {
    if (!scriptLoaded || hasPromptedRef.current) return;
    if (!window.google?.accounts?.id) {
      if (!(error instanceof ScriptLoadError)) {
        const err = new ScriptLoadError();
        setError(err);
        onError?.(err);
      }
      return;
    }

    if (!clientId) {
      if (!(error instanceof MissingClientIdError)) {
        const err = new MissingClientIdError();
        setError(err);
        onError?.(err);
      }
      return;
    }

    hasPromptedRef.current = true;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: response => {
        if (response.credential) {
          onSuccess(response.credential, response);
        } else {
          const err = new MissingCredentialError();
          setError(err);
          onError?.(err);
        }
      },
    });

    window.google.accounts.id.prompt(notification => {
      const dismissed =
        notification.isNotDisplayed() ||
        notification.isSkippedMoment() ||
        notification.isDismissedMoment();

      if (dismissed) {
        setIsPromptVisible(false);
        setHasDismissed(true);
        onDismiss?.();
        return;
      }

      setIsPromptVisible(true);
      onPromptStart?.();
    });
  }, [scriptLoaded, clientId, onSuccess, onPromptStart, onDismiss, onError, error]);

  return {
    isPromptVisible,
    hasDismissed,
    error,
  };
}
