import React from 'react';

import { Auth } from '../services/AuthService';
import { RouteComponentProps } from 'react-router';
import { useIonViewWillEnter, IonPage, IonContent, IonSpinner } from '@ionic/react';
import "./RedirectScreens.css"


interface EndRedirectPageProps extends RouteComponentProps {
}

const EndRedirect: React.FC<EndRedirectPageProps> = (props: EndRedirectPageProps) => {

  useIonViewWillEnter(() => {
    Auth.Instance.endSessionCallback();
    setInterval(() => props.history.replace('landing'), 2500)
  });

  return (
    <IonPage>
    <IonContent fullscreen className="loading-content">
      <div className="loading-wrapper">
        <IonSpinner name="bubbles" className="loading-spinner" />
        <p className="loading-text">Logging out...</p>
      </div>
    </IonContent>
    </IonPage>
  );
};

export default EndRedirect;