import { renderHook } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import useLoadIdentityScript from './useLoadIdentityScript';
import { ScriptLoadError } from '../errors';

describe('useLoadIdentityScript', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.head.innerHTML = '';
  });

  it('loads script and calls onScriptLoadSuccess', () => {
    const onSuccess = vi.fn();

    renderHook(() =>
      useLoadIdentityScript({
        onScriptLoadSuccess: onSuccess,
      }),
    );

    const script = document.getElementById('google-identity-services') as HTMLScriptElement;
    expect(script).toBeTruthy();

    script.onload?.(new Event('load'));

    expect(onSuccess).toHaveBeenCalled();
  });

  it('calls onScriptLoadError on script load failure', () => {
    const onError = vi.fn();

    renderHook(() =>
      useLoadIdentityScript({
        onScriptLoadError: onError,
      }),
    );

    const script = document.getElementById('google-identity-services') as HTMLScriptElement;
    script.onerror?.(new Event('error') as any);

    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0]).toBeInstanceOf(ScriptLoadError);
  });

  it('skips adding new script if one already exists', () => {
    const existing = document.createElement('script');
    existing.id = 'google-identity-services';
    document.head.appendChild(existing);

    const onSuccess = vi.fn();

    renderHook(() =>
      useLoadIdentityScript({
        onScriptLoadSuccess: onSuccess,
      }),
    );

    expect(document.querySelectorAll('#google-identity-services').length).toBe(1);
  });
});
