import { useHistory } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useTransition, useState } from 'react';
import { IonButton } from '@ionic/react';
import { clearAccount } from '../modules/dalAccount';

export const LogoutComponent = () => {
  const history = useHistory();
  const [isPending, startTransition] = useTransition(); // Allows non-blocking updates
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await clearAccount();

      // Use startTransition to make sure the state updates smoothly
      startTransition(() => {
        setLoading(false); 
        history.push('/landing'); 
      });
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  if (loading || isPending) {
    return <div>Logging out...</div>; 
  }

  return (
    <IonButton className="button" color="light" onClick={handleLogout} expand='block'>Log Out</IonButton>
  );
};

