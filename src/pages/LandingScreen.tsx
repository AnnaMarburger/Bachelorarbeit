import React from 'react';
import {
  IonContent,
  IonButton,
  IonPage,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  useIonRouter,
  useIonViewWillEnter,
  IonText
} from '@ionic/react';
import { RegistrationUtils } from '../utils/auth/registration.utils'
import { Account } from '../modules/account';
import { readFromStorage, updateAccount } from '../modules/dalAccount';
import { loginUser } from '../modules/LoginComponent';
import { useTranslation } from 'react-i18next';
import { Preferences } from '@capacitor/preferences';

import './LandingScreen.css';

// landing screen with buttons to login / sign up / sign up anonymously
const LandingScreen: React.FC = () => {
  const router = useIonRouter();
  const { t } = useTranslation();

  useIonViewWillEnter(() => {
    // check if there is a local account instance on this device and login automatically if so
    readFromStorage().then(async (acc) => {
      if (acc?.userName && acc?.password) {
        await loginUser(acc.userName, acc.password);
        router.push('/home/tab4', "none");
      }
    });
  }, []);

  // creates a unique random 12 character password, used for anonymous sign ups
  function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // sign up an user anonymously (with a generated password and without a name)
  async function handleAnonymousSignIn() {
    //create new account
    const password = generatePassword();
    const account = new Account(undefined, undefined, undefined, password, undefined, undefined);
    const response = await RegistrationUtils.createAnonymousUser(account);
    account.userName = response.userName;
    account.id = response.id;
    account.familyName = response.familyName;
    account.name = response.givenName;
    await updateAccount(account);

    //login with new account
    await loginUser(account.userName ?? "", account.password);

    //register in tenant and study of this application
    await RegistrationUtils.registerInTenant();
    await RegistrationUtils.registerInStudy();
  }

  return (
    <IonPage>
      <IonContent className='landing-content'>
        <IonCard className='landing-card'>
          <img src='graphic-login.png' height="300"></img>
          <IonCardHeader>
            <IonCardTitle color="light" className='landing-title'>
              {t("WelcomeScreen.Header")}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText color='light'>{t("WelcomeScreen.Text")}</IonText>
            <div className='buttons'>
              <IonButton routerLink='/login' expand="block" color="light">{t("WelcomeScreen.Login")}</IonButton>
              <IonButton routerLink='/signup' expand="block" color="light">{t("WelcomeScreen.SignUp")}</IonButton>
              <IonButton expand='block' color="light" onClick={async () => {
                await handleAnonymousSignIn();
                const disclaimerSeen = await Preferences.get({ key: "acceptedDisclaimer" });
                if (disclaimerSeen.value === "true") {
                  router.push('/home/tab4', "none");
                } else {
                  router.push('/disclaimer', "none");
                }
              }}>{t("WelcomeScreen.Anonymous")}</IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage >
  );
};

export default LandingScreen;