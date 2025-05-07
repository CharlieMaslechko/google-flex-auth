// core/errors.ts

export class GoogleAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleAuthError';
  }
}

export class ScriptLoadError extends GoogleAuthError {
  constructor() {
    super('Failed to load Google Identity Services script.');
    this.name = 'ScriptLoadError';
  }
}

export class MissingClientIdError extends GoogleAuthError {
  constructor() {
    super('Missing Google Client ID.');
    this.name = 'MissingClientIdError';
  }
}

export class MissingCredentialError extends GoogleAuthError {
  constructor() {
    super('Missing Google Credential.');
    this.name = 'MissingCredentialError';
  }
}

export class PopupBlockedError extends GoogleAuthError {
  constructor() {
    super('Popup was blocked by the browser.');
    this.name = 'PopupBlockedError';
  }
}

export class MissingAuthProviderError extends GoogleAuthError {
  constructor() {
    super('useGoogleFlexAuth must be used within a GoogleFlexAuthProvider');
    this.name = 'MissingAuthProviderError';
  }
}
