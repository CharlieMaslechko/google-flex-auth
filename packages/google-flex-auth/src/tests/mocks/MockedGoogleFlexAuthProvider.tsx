import React, { useState } from 'react';
import { GoogleFlexAuthContext } from '../../core/context/GoogleFlexAuthProvider';

interface MockedProviderProps {
  clientId: string;
  initialScriptLoaded?: boolean;
  children: React.ReactNode;
}

const MockedProvider: React.FC<MockedProviderProps> = ({
  clientId,
  initialScriptLoaded = true, // Default to true for existing tests
  children,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(initialScriptLoaded);

  // You could add functions here to simulate script loading success/failure
  // if needed for more complex test scenarios.

  const value = { clientId, scriptLoaded };

  return <GoogleFlexAuthContext.Provider value={value}>{children}</GoogleFlexAuthContext.Provider>;
};

export default MockedProvider;
