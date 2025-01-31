import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonInput, IonInputPasswordToggle, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { loginUser } from '../modules/LoginComponent';
import { Account } from '../modules/account';
import { RegistrationUtils } from '@utils/auth/registration.utils';
import { readActiveAccount, updateAccount } from '../modules/dalAccount';

import './LoginScreens.css';
import "./main.css"

const SignUpScreen: React.FC = () => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [name, setName] = useState("");


    async function signUp() {
        //check passwort 
        if(password !== passwordCheck){
            alert(t("SignUpScreen.AlertPasswordCheckFail"));
            return;
        }
        if(password.length < 8){
            alert(t("SignUpScreen.AlertPasswordTooShort"));
            return;
        }

        //check name
        if(name.length < 2){
            alert(t("SignUpScreen.AlertNameTooShort"));
            return;
        }

        //create new account
        const account = new Account(undefined, undefined, undefined, password, undefined, name);
        const response = await RegistrationUtils.createAnonymousUser(account);
        if(response)
        account.id = response.id;
        await updateAccount(account);

        //login with new account
        const success = await loginUser(account.userName ?? "", account.password);
        if (success) {
            //register in tenant and study
            await RegistrationUtils.registerInTenant();
            await RegistrationUtils.registerInStudy();
            router.push('/disclaimer', "none");
        } else {
            alert(t("SignUpScreen.AlertFail"));
            return;
        }
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonCard className='ion-no-margin'>
                    <IonCardHeader>
                        <IonCardTitle color="light" className='loginheader'>
                            {t("SignUpScreen.Header")}
                        </IonCardTitle>
                        <IonCardSubtitle color="light"></IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div className='InputFieldsLogIn'>
                            <IonInput value={name} onIonInput={(e: any) => setName(e.detail.value || "")} color="light" className='custom' fill="outline" label={t("SignUpScreen.Name")} labelPlacement="floating"></IonInput>
                            <br/>
                            <IonInput value={password} onIonInput={(e: any) => setPassword(e.detail.value || "")} color="light" className='custom' fill="outline" label={t("SignUpScreen.Password")} labelPlacement="floating">
                                <IonInputPasswordToggle color="light" slot="end"></IonInputPasswordToggle>
                            </IonInput>
                            <br/>
                            <IonInput value={passwordCheck} onIonInput={(e: any) => setPasswordCheck(e.detail.value || "")} color="light" className='custom' fill="outline" label={t("SignUpScreen.PasswordCheck")} labelPlacement="floating">
                                <IonInputPasswordToggle color="light" slot="end"></IonInputPasswordToggle>
                            </IonInput>
                        </div>
                        <br/>
                        <div className='buttons'>
                            <IonButton shape='round' className='buttons-login' color="light" onClick={() => { signUp(); }}> {t("SignUpScreen.Button")}</IonButton>
                            <br/>
                            <IonText color="light"><a className="link" href='/landing'>{t("SignUpScreen.Back")}</a></IonText>
                        </div>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage >

    );
};

export default SignUpScreen;