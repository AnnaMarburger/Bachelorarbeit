
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonIcon, IonPage, IonTitle, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { Auth } from '../services/AuthService';
import { t } from 'i18next';
import { AuthActionBuilder, AuthActions } from 'ionic-appauth';
import { Subscription } from 'rxjs';
import { useState } from 'react';
import { person } from 'ionicons/icons';
import "./Tab4.css";
import { CurrentUserClient } from '@api/GatewayAPIClient';
import { useGatewayApi } from '@api/useGatewayApi';
import { Account, AccountLayer } from '../modules/dalAccount';



const Tab4: React.FC = () => {
  const [action, setAction] = useState(AuthActionBuilder.Init);
  const [user, setUser] = useState(Auth.Instance.loadUserInfo());
  let subs: Subscription[] = [];

  useIonViewWillEnter(() => {
    subs.push(
      Auth.Instance.events$.subscribe((action) => {
        setAction(action);
      }),
      Auth.Instance.user$.subscribe((user) => {
        setUser(user)
      })
    )
  });


  useIonViewDidLeave(() => {
    subs.forEach(sub => sub.unsubscribe());
  });


  function handleSignOut(e: any) {
    e.preventDefault();
    Auth.Instance.signOut();
  }

  function handleRefresh(e: any) {
    e.preventDefault();
    Auth.Instance.refreshToken();
  }

  return (
    <IonPage>
      <IonContent >
        <IonCard className='usercontent'>
          <IonCardHeader>
           <IonTitle>Your Name</IonTitle>
          </IonCardHeader>
          <IonCardContent>
          <IonIcon icon={person} size="large" color='light'></IonIcon>
            <div className='userinfos'>
              {JSON.stringify(user)}
            </div>
            <div className='buttons'>
              <IonButton shape='round' color="light" onClick={handleSignOut}>Sign Out</IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;

