/*----------------------------------- Imports -----------------------------------------------------------*/

import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonInput, IonInputPasswordToggle, IonPage, IonText, useIonAlert, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import './LoginScreens.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Auth } from '../services/AuthService';
import { Subscription } from 'rxjs';
import { AuthActionBuilder, AuthActions } from 'ionic-appauth';

/*----------------------------------- Functions -----------------------------------------------------------*/

async function logIn(e: any) {


    //validate input (username only alpha numeric, password no critical special chars)
    //if (!/^[A-Za-z0-9]+$/.test(username) || ( /[`'"\\&<>|/]/.test(password))) return "LoginScreen.LoginFailed.errInput";


    // TODO send to server
    //const hashedpwd = Md5.hashStr();

    // TODO check if successful
    // TODO route to homepage

    console.log("login");
    return ""
}



/*----------------------------------- Components -----------------------------------------------------------*/


const LoginScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [presentAlert] = useIonAlert();

    const [action, setAction] = useState(AuthActionBuilder.Init);

  let sub: Subscription;



  useIonViewDidLeave(() => {
    sub.unsubscribe();
  });


    return (
        <IonPage>
            <IonContent fullscreen>
                <IonCard className='ion-no-margin'>
                    <IonCardHeader>
                        <IonCardTitle color="light" className='loginheader'>
                            {t("LoginScreen.Header")}
                        </IonCardTitle>
                        <IonCardSubtitle color="light"></IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div className='InputFieldsLogIn'>
                            <IonInput value={username} onIonInput={(e:any) => setUsername(e.detail.value || "")} color="light" className='custom' fill="outline" label={t("LoginScreen.Name")} labelPlacement="floating"></IonInput>
                            <br />
                            <IonInput value={password} onIonInput={(e:any) => setPassword(e.detail.value || "")} color="light" className='custom' fill="outline" label={t("LoginScreen.Password")} labelPlacement="floating">
                                <IonInputPasswordToggle color="light" slot="end"></IonInputPasswordToggle>
                            </IonInput>
                            <br />
                            <IonText color="light">{t("LoginScreen.Forgot")}</IonText>
                        </div>
                        <br />
                        <div className='buttons'>
                            <IonButton shape='round' className='buttons-login' color="light" onClick={logIn}> Login </IonButton>
                            <br />
                            <IonText color="light"><a href='/signup'>{t("LoginScreen.SignUp")}</a></IonText>
                        </div>


                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>

    );
};

export default LoginScreen;