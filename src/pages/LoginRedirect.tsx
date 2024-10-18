import React from 'react';

import { Auth } from '../services/AuthService';
import { AuthActions } from 'ionic-appauth';
import { RouteComponentProps } from 'react-router';
import { useIonViewDidLeave, useIonViewDidEnter, IonPage, IonSpinner, IonContent } from '@ionic/react';
import { Subscription } from 'rxjs';
import "./RedirectScreens.css"

interface LoginRedirectPageProps extends RouteComponentProps { }

const LoginRedirect: React.FC<LoginRedirectPageProps> = (props: LoginRedirectPageProps) => {
  let sub: Subscription;

  useIonViewDidEnter(() => {
    const url = window.location.origin + props.location.pathname + props.location.search;
    Auth.Instance.authorizationCallback(url);
    sub = Auth.Instance.events$.subscribe((action) => {
      if (action.action === AuthActions.SignInSuccess) {
        console.log("login redirect " + localStorage.getItem("acceptedDisclaimer"));
        if(localStorage.getItem("acceptedDisclaimer") === "true"){
          setInterval(() => props.history.replace('home'), 2500)
        } else {
          props.history.replace('disclaimer')
        }

      }

      if (action.action === AuthActions.SignInFailed) {
        setInterval(() => props.history.replace('landing'), 2500)
      }
    });
  });

  useIonViewDidLeave(() => {
    sub.unsubscribe();
  });

  return (
    <IonPage>
    <IonContent fullscreen className="loading-content">
      <div className="loading-wrapper">
        <IonSpinner name="bubbles" className="loading-spinner" />
        <p className="loading-text">Signing in, please wait...</p>
      </div>
    </IonContent>
    </IonPage>
  );
};

export default LoginRedirect;