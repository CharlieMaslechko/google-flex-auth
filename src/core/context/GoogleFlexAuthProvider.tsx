import { createContext, useContext, useMemo, ReactNode } from 'react';
import useLoadIdentityScript from '../hooks/useLoadIdentityScript';
import { JSX } from 'react/jsx-runtime';
import { MissingAuthProviderError } from '../errors';

export interface GoogleFlexAuthContextValue {
  clientId: string;
  scriptLoaded: boolean;
}

export const GoogleFlexAuthContext = createContext<GoogleFlexAuthContextValue | undefined>(
  undefined,
);

export interface GoogleFlexAuthProviderProps {
  clientId: string;
  nonce?: string;
  onScriptLoadSuccess?: () => void;
  onScriptLoadError?: (error: Error) => void;
  children: ReactNode;
}

export function GoogleFlexAuthProvider({
  clientId,
  nonce,
  onScriptLoadSuccess,
  onScriptLoadError,
  children,
}: GoogleFlexAuthProviderProps): JSX.Element {
  const scriptLoaded = useLoadIdentityScript({
    nonce,
    onScriptLoadSuccess,
    onScriptLoadError,
  });

  const value = useMemo(() => ({ clientId, scriptLoaded }), [clientId, scriptLoaded]);

  return <GoogleFlexAuthContext.Provider value={value}>{children}</GoogleFlexAuthContext.Provider>;
}

export function useGoogleFlexAuth(): GoogleFlexAuthContextValue {
  const context = useContext(GoogleFlexAuthContext);
  if (!context) {
    throw new MissingAuthProviderError();
  }
  return context;
}
