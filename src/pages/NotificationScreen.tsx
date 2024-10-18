import "./main.css";
import { LocalNotifications } from "@capacitor/local-notifications";
import { IonPage, IonContent, IonButton, IonDatetime, IonHeader, IonItem, IonLabel, IonTitle, IonToggle, IonToolbar, IonButtons, IonIcon, IonList } from "@ionic/react";
import { useState } from "react";
import { arrowBack } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import "./Tab4.css";
import "./main.css"

const NotifScreen: React.FC = () => {
    const { t, i18n } = useTranslation();

    // State für den Toggle und die Uhrzeit
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [selectedTime, setSelectedTime] = useState('12:00');

    // Funktion zum Handhaben der Speichern-Aktion
    const handleSave = () => {
        // Hier könntest du die Logik hinzufügen, um die Einstellungen zu speichern, z. B. in einer API oder lokal.
        console.log('Einstellungen gespeichert: ', {
            notificationsEnabled,
            selectedTime
        });
        alert('Einstellungen gespeichert!');
        history.back();
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="toolbar">
                    <IonTitle>{t("NotifScreen.Title")}</IonTitle>
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.back()}><IonIcon icon={arrowBack}/></IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList inset={true} className='notif-list'>
                    <IonItem>
                        <IonLabel color="light">{t("NotifScreen.ToggleLabel")}</IonLabel>
                        <IonToggle color="light" slot="end"
                            checked={notificationsEnabled}
                            onIonChange={(e: any) => setNotificationsEnabled(e.detail.checked)}
                        />
                    </IonItem>

                    {notificationsEnabled && (
                        <IonItem>
                            <IonLabel color="light">{t("NotifScreen.TimerPickerLabel")}</IonLabel>
                            <IonDatetime className="datetime" presentation="time" value={selectedTime} onIonChange={(e: any) => setSelectedTime(e.detail.value!)}/>
                        </IonItem>
                    )}
                </IonList>

                <IonButton className="button" color="light" expand="block" onClick={handleSave}>{t("NotifScreen.Button")}</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default NotifScreen;
