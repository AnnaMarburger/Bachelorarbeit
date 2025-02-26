import { useState, useEffect, ReactNode } from 'react';
import { readFromStorage } from '../modules/dalAccount';
import { Redirect } from 'react-router-dom';
import { Account } from 'modules/account';

type Props = { children?: ReactNode };

// a private route implementation that makes sure that users can't route to app if they're not logged in 
export const PrivateRoute = ({ children }: Props) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccount = async () => {
      const storedAccount = await readFromStorage();  
      setAccount(storedAccount);
      setLoading(false);
    };

    loadAccount();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!account) return <Redirect to="/login" />;
  return <>{children}</>;
};
