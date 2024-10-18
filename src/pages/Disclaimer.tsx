import React from "react";
import { IonButton, IonContent, IonPage } from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import "./main.css";
import { LocalNotifications } from "@capacitor/local-notifications";

interface DisclaimerPageProps extends RouteComponentProps {}

const Disclaimer: React.FC<DisclaimerPageProps> = (props: DisclaimerPageProps) => {

    const handleAccept = async () => {
        // Set the flag in local storage
        localStorage.setItem("disclaimerAccepted", "true");

        //accept notifications
        const answer = await LocalNotifications.requestPermissions();
        console.log(answer.display);

        //change screen
        props.history.replace('home');
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
