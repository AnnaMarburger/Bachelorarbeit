import React from "react";
import { IonButton, IonContent, IonPage, useIonRouter } from "@ionic/react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Preferences } from "@capacitor/preferences";

import "../main.css";

const Disclaimer: React.FC = () => {
    const router = useIonRouter();
    const handleAccept = async () => {
        // Set the flag in local storage
        await Preferences.set({
            key: 'acceptedDisclaimer',
            value: 'true',
        });

        //accept notifications
        const answer = await LocalNotifications.requestPermissions();
        console.log(answer.display);

        //change to homescreen
        router.push('/home/tab4');
    };


    return (
        <IonPage>
            <IonContent>
                <div className="disclaimer">
                    <h1>Disclaimer</h1>
                    <p>Please read and accept our terms and conditions before proceeding.</p>
                    <IonButton color="light" expand="block" onClick={handleAccept}>Accept</IonButton>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default Disclaimer;
