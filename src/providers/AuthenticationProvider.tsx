import { IonSpinner } from '@ionic/react';
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { readActiveAccount, subscribeAccount } from '../modules/dalAccount';

type Context = {
  isAuthenticated: boolean;
};

export const AuthenticationContext = createContext<Context>({
  isAuthenticated: false,
});

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const account = useSyncExternalStore(subscribeAccount, readActiveAccount);

  useEffect(() => {
    setIsAuthenticated(!!account);
  }, [account]);

  return (
    <AuthenticationContext.Provider value={{ isAuthenticated }}>
      {isAuthenticated ? children : <IonSpinner />}
    </AuthenticationContext.Provider>
  );
};