import React from "react";
import { IonButton, IonContent, IonPage, useIonRouter } from "@ionic/react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Preferences } from "@capacitor/preferences";
import { useTranslation } from "react-i18next";

import "../main.css";

// disclaimer screen that presents a text that describes the disclaimer of the app and has to be accepted by the user
const Disclaimer: React.FC = () => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const handleAccept = async () => {
        // set the flag in local storage that the disclaimer was accepted
        await Preferences.set({
            key: 'acceptedDisclaimer',
            value: 'true',
        });

        // ask the user for notifivation permission
        await LocalNotifications.requestPermissions();
        router.push('/home/tab4');
    };


    return (
        <IonPage>
            <IonContent className='ion-content-safe'>
                <div className="disclaimer">
                    <h1>{t("DisclaimerScreen.Header")}</h1>
                    <p>{t("DisclaimerScreen.Text")}</p>
                    <IonButton color="light" expand="block" onClick={handleAccept}>{t("DisclaimerScreen.Button")}</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Disclaimer;
