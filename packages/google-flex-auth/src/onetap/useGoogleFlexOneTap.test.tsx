import { renderHook } from '@testing-library/react';
import { beforeEach, expect, vi, describe, it } from 'vitest';
import { useGoogleFlexOneTap } from './useGoogleFlexOneTap';
import MockedProvider from '../tests/mocks/MockedGoogleFlexAuthProvider'; // Assuming you put MockedProvider in a __mocks__ folder
import { ScriptLoadError } from '../core/errors';

describe('useGoogleFlexOneTap', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    (global as any).window.google = {
      accounts: {},
    };
    document.head.innerHTML = '';
  });

  it('returns default state before script loads', () => {
    const { result } = renderHook(() => useGoogleFlexOneTap({ onSuccess: vi.fn() }), {
      wrapper: ({ children }) => (
        <MockedProvider clientId="test-client" initialScriptLoaded={false}>
          {children}
        </MockedProvider>
      ),
    });

    expect(result.current.isPromptVisible).toBe(false);
    expect(result.current.hasDismissed).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('sets error if google.accounts.id is missing', () => {
    // Simulate the script loading but google.accounts.id not being available
    (global as any).window.google = { accounts: {} };
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useGoogleFlexOneTap({
          onSuccess: vi.fn(),
          onError,
        }),
      {
        wrapper: ({ children }) => (
          <MockedProvider clientId="test-client" initialScriptLoaded={true}>
            {children}
          </MockedProvider>
        ),
      },
    );

    expect(result.current.error).toBeInstanceOf(ScriptLoadError);
    expect(onError).toHaveBeenCalledWith(expect.any(ScriptLoadError));
  });

  // More tests will be added to cover the prompt lifecycle and success paths
  // by mocking the google.accounts.id.prompt function.
});
