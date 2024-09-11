import React, { useState } from 'react';
import {
  IonContent,
  IonButton,
  IonPage,
  useIonViewWillEnter,
  useIonViewDidLeave,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import { Auth } from '../services/AuthService';
import { AuthActions, AuthActionBuilder } from 'ionic-appauth';
import { RouteComponentProps } from 'react-router';
import { Subscription } from 'rxjs';
import { t } from 'i18next';
import './LandingScreen.css';
import { CreateAnonymousUserCommand, UsersClient } from '@api/GatewayAPIClient';

interface LandingPageProps extends RouteComponentProps {
}

const LandingScreen: React.FC<LandingPageProps> = (props: LandingPageProps) => {

  const [action, setAction] = useState(AuthActionBuilder.Init);

  let sub: Subscription;

  useIonViewWillEnter(() => {
    sub = Auth.Instance.events$.subscribe((action) => {
      setAction(action)
      if (action.action === AuthActions.SignInSuccess) {
        // The pause below helps alleviate the following error in iOS:
        //   SecurityError: Attempt to use history.replaceState() more than 100 times per 30 seconds
        // However, it doesn't solve it completely as it happen if you log out and log in again.
        // Similar behavior happens in Android on subsequent logins.
        setInterval(() => props.history.replace('home'), 500)
      }
    });
  });

  useIonViewDidLeave(() => {
    sub.unsubscribe();
  });

  function handleSignIn(e: any) {
    e.preventDefault();
    Auth.Instance.signIn();
  }

  function handleAnonymousSignIn(e: any) {
    e.preventDefault();
    const userclient = new UsersClient(import.meta.env.VITE_OIDC_SERVER_URL);
    const response = userclient.createAnonymousUser(new CreateAnonymousUserCommand());
    console.log(response);
  }

  return (
    <IonPage>
    <IonContent fullscreen className='landing-content'>
        <div className='welcomescreen-card'>
            <IonCard className='landing-card'>
                <img src='../img/graphic-login.png' height="300"></img>
                <IonCardHeader>
                    <IonCardTitle color="light" className='landing-title'>
                        {t("WelcomeScreen.Header")}
                    </IonCardTitle>
                    <IonCardSubtitle color="light">{t("WelcomeScreen.SkipLogin")}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                    <div className='buttons'>
                        <IonButton shape='round' color="light" onClick={handleSignIn}>Login</IonButton>
                        <IonButton shape='round' color="light" onClick={handleAnonymousSignIn}>Anonym</IonButton>
                    </div>
                </IonCardContent>
            </IonCard>
        </div>
    </IonContent>
</IonPage>
  );
};

export default LandingScreen;