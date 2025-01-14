import { useIonRouter, IonPage, IonContent, IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { close } from 'ionicons/icons';
import { useState, useEffect } from "react";

import "./InfoPage.css";
import "./SubScreens.css";

const LegalNoticeScreen: React.FC = () => {
    const router = useIonRouter();
    const { t } = useTranslation();
    const [policyText, setPolicyText] = useState<string>("");

    useEffect(() => {
        fetch("/legalnotice.txt")
            .then(response => response.text())
            .then(data => setPolicyText(data))
            .catch(error => {
                console.error("Error loading legal notice text:", error);
                setPolicyText("Policy could not be loaded.");
            });
    }, []);

    return (
        <IonPage className="light-background">
            <IonHeader translucent={false} className="ion-no-border" id="infoPage-header">
                <IonToolbar>
                    <IonTitle id="infoPage-title">{t("LegalNotice.Title")}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => { router.push("/home/tab4", "back"); }}>
                            <IonIcon icon={close}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="infoContent">
                <div className="subpages-content">{policyText}</div>
            </IonContent>
        </IonPage>
    );
};

export default LegalNoticeScreen;