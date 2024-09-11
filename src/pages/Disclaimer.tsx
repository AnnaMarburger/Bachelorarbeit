import React from "react";
import { IonButton, IonContent, IonPage } from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import "./main.css";


interface DisclaimerPageProps extends RouteComponentProps {
}

const Disclaimer: React.FC<DisclaimerPageProps> = (props: DisclaimerPageProps) => {

    const handleAccept = () => {
        // Set the flag in local storage
        localStorage.setItem("disclaimerAccepted", "true");
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
