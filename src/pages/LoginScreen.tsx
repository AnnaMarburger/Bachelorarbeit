import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonInput, IonInputPasswordToggle, IonPage, IonText, useIonRouter} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { loginUser } from '../components/LoginComponent';
import { Preferences } from '@capacitor/preferences';

import './LoginScreens.css';


const LoginScreen: React.FC = () => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
                        </div>
                        <br />
                        <div className='buttons'>
                            <IonButton shape='round' className='buttons-login' color="light" onClick={async () => {
                                const success = await loginUser(username, password);
                                const disclaimerSeen = await Preferences.get({key : "acceptedDisclaimer"});
                                if (disclaimerSeen.value === "true" && success) {
                                    router.push('/home/tab4', "none");
                                } else if (success){
                                    router.push('/disclaimer', "none");
                                } else {
                                    alert(t("LoginScreen.AlertFail"))
                                }
                            }}>{t("LoginScreen.Button")}</IonButton>
                        <br />
                        <IonText color="light"><a className="link" href='/signup'>{t("LoginScreen.SignUp")}</a></IonText>
                    </div>
                </IonCardContent>
            </IonCard>
        </IonContent>
        </IonPage >

    );
};

export default LoginScreen;