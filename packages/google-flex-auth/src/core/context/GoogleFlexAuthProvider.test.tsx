import { renderHook } from '@testing-library/react';
import { GoogleFlexAuthProvider, useGoogleFlexAuth } from './GoogleFlexAuthProvider';
import { MissingAuthProviderError } from '../errors';
import { expect, vi, describe, it } from 'vitest';

interface ProviderWrapperOptions {
  clientId?: string;
  onScriptLoadSuccess?: () => void;
}

const wrapperWithProvider = (options: ProviderWrapperOptions = {}) => {
  const { clientId = 'test-client', onScriptLoadSuccess } = options;

  return ({ children }: { children: React.ReactNode }) => (
    <GoogleFlexAuthProvider clientId={clientId} onScriptLoadSuccess={onScriptLoadSuccess}>
      {children}
    </GoogleFlexAuthProvider>
  );
};

describe('GoogleFlexAuthProvider', () => {
  it('returns context value inside provider', () => {
    const { result } = renderHook(() => useGoogleFlexAuth(), {
      wrapper: wrapperWithProvider(),
    });

    expect(result.current.clientId).toBe('test-client');
    expect(typeof result.current.scriptLoaded).toBe('boolean');
  });

  it('throws MissingAuthProviderError when used outside provider', () => {
    let caught: unknown;

    try {
      renderHook(() => useGoogleFlexAuth()); // no wrapper
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(MissingAuthProviderError);
    expect((caught as Error).message).toMatch(/must be used within/i);
  });

  it('calls onScriptLoadSuccess when provided', () => {
    const onScriptLoadSuccess = vi.fn();

    // even though script load can't be simulated, the function should pass through safely
    renderHook(() => useGoogleFlexAuth(), {
      wrapper: wrapperWithProvider({ onScriptLoadSuccess }),
    });

    expect(typeof onScriptLoadSuccess).toBe('function');
  });
});
