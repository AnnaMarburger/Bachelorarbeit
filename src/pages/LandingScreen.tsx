import React, { startTransition, useContext, useEffect, useState } from 'react';
import {
  IonContent,
  IonButton,
  IonPage,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  useIonRouter,
} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import './LandingScreen.css';
import { RegistrationUtils } from '../utils/auth/registration.utils'
import { Account } from '../modules/account';
import { readFromStorage, readActiveAccount, updateAccount } from '../modules/dalAccount';
import { loginUser } from '@components/LoginComponent';
import { useTranslation } from 'react-i18next';


interface LandingPageProps extends RouteComponentProps {
}

const LandingScreen: React.FC<LandingPageProps> = (props: LandingPageProps) => {
  const router = useIonRouter();
  const { t } = useTranslation();

  useEffect(() => {
    readFromStorage().then(async acc => {
      if(acc?.userName && acc?.password){
        console.log("perform autologin", acc);
        await loginUser(acc.userName, acc.password);
        router.push('/home/tab4');
      } 
    });
  }, []);

  function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async function handleAnonymousSignIn() {
    const password = generatePassword();
    const account = new Account(undefined, undefined, undefined, password, undefined, undefined);
    const response = RegistrationUtils.createAnonymousUser(account);
    console.log(response);
    response.then(e => {
      account.userName = e.userName;
      account.id = e.id;
      account.familyName = e.familyName;
      account.name = e.givenName;
    });
    await updateAccount(account);
    console.log("saved new account", readActiveAccount());
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
                <IonButton routerLink='/login' shape='round' color="light">Login</IonButton>
                <IonButton shape='round' color="light" onClick={async() => {
                  await  handleAnonymousSignIn();
                  router.push('/home/tab4');
                }}>Anonym</IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    </IonContent>
</IonPage >
  );
};

export default LandingScreen;