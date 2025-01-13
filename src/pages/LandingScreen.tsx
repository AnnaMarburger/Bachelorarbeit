import React from 'react';
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
  useIonViewWillEnter,
} from '@ionic/react';
import { RegistrationUtils } from '../utils/auth/registration.utils'
import { Account } from '../modules/account';
import { readFromStorage, readActiveAccount, updateAccount } from '../modules/dalAccount';
import { loginUser } from '@components/LoginComponent';
import { useTranslation } from 'react-i18next';
import { Preferences } from '@capacitor/preferences';

import './LandingScreen.css';


const LandingScreen: React.FC = () => {
  const router = useIonRouter();
  const { t } = useTranslation();

  useIonViewWillEnter(() => {
    readFromStorage().then(async acc => {
      if (acc?.userName && acc?.password) {
        console.log("perform autologin", acc);
        await loginUser(acc.userName, acc.password);
        router.push('/home/tab4', "none");
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
    //create new account
    const password = generatePassword();
    const account = new Account(undefined, undefined, undefined, password, undefined, undefined);
    const response = await RegistrationUtils.createAnonymousUser(account);
    account.userName = response.userName;
    account.id = response.id;
    account.familyName = response.familyName;
    account.name = response.givenName;
    await updateAccount(account);
    console.log("saved new account", readActiveAccount());

    //login with new account
    await loginUser(account.userName ?? "", account.password);

    //register in tenant and study
    await RegistrationUtils.registerInTenant();
    await RegistrationUtils.registerInStudy();
    console.log("registered");

  }

  return (
    <IonPage>
      <IonContent fullscreen className='landing-content'>
        <div className='welcomescreen-card'>
          <IonCard className='landing-card'>
            <img src='graphic-login.png' height="300"></img>
            <IonCardHeader>
              <IonCardTitle color="light" className='landing-title'>
                {t("WelcomeScreen.Header")}
              </IonCardTitle>
              <IonCardSubtitle color="light">{t("WelcomeScreen.SkipLogin")}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <div className='buttons'>
                <IonButton routerLink='/login' shape='round' color="light">Login</IonButton>
                <IonButton shape='round' color="light" onClick={async () => {
                  await handleAnonymousSignIn();
                  const disclaimerSeen = await Preferences.get({ key: "acceptedDisclaimer" });
                  if (disclaimerSeen.value === "true") {
                    router.push('/home/tab4', "none");
                  } else {
                    router.push('/disclaimer', "none");
                  }
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