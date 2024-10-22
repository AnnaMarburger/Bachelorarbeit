/*----------------------------------- Imports -----------------------------------------------------------*/

import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonInput, IonInputPasswordToggle, IonPage, IonText, useIonAlert, useIonRouter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import './LoginScreens.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { getResourceOwnerPasswordFlowToken } from '@utils/auth/token.utils';
import { updateAccount } from '../modules/dalAccount';
import { Account } from '../modules/account';
import { RouteComponentProps } from 'react-router-dom';

interface LoginPageProps extends RouteComponentProps {
}

const LoginScreen: React.FC<LoginPageProps> = (props: LoginPageProps) => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [presentAlert] = useIonAlert();

    const loginUser = async (_username: string, _password: string) => {
        try {
            // Token abrufen
            const tokenResponse = await getResourceOwnerPasswordFlowToken(
                username,
                password,
                import.meta.env.VITE_HSP_OIDC_TOKEN_URL as string
            );

            // Zugriffstoken für weitere Anfragen speichern
            const userAcc = new Account(undefined, tokenResponse.access_token, _username, _password, undefined, undefined);
            await updateAccount(userAcc);
            console.log('User successfully logged in with access token:', tokenResponse.access_token);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

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
                            <IonInput value={username} onIonInput={(e: any) => setUsername(e.detail.value || "")} color="light" className='custom' fill="outline" label={t("LoginScreen.Name")} labelPlacement="floating"></IonInput>
                            <br />
                            <IonInput value={password} onIonInput={(e: any) => setPassword(e.detail.value || "")} color="light" className='custom' fill="outline" label={t("LoginScreen.Password")} labelPlacement="floating">
                                <IonInputPasswordToggle color="light" slot="end"></IonInputPasswordToggle>
                            </IonInput>
                            <br />
                            <IonText color="light">{t("LoginScreen.Forgot")}</IonText>
                        </div>
                        <br />
                        <div className='buttons'>
                            <IonButton shape='round' className='buttons-login' color="light" onClick={async () => {
                                await loginUser(username, password);
                                router.push('/home/tab4');
                            }}> Login </IonButton>
                        <br />
                        <IonText color="light"><a href='/signup'>{t("LoginScreen.SignUp")}</a></IonText>
                    </div>
                </IonCardContent>
            </IonCard>
        </IonContent>
        </IonPage >

    );
};

export default LoginScreen;