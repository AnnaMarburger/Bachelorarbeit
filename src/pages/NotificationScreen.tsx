import "./main.css";
import { LocalNotifications } from "@capacitor/local-notifications";
import { IonPage, IonContent, IonButton, IonDatetime, IonHeader, IonItem, IonLabel, IonTitle, IonToggle, IonToolbar, IonButtons, IonIcon, IonList, IonBackButton, useIonRouter } from "@ionic/react";
import { useState } from "react";
import { arrowBack } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import "./Tab4.css";
import "./main.css"

const NotifScreen: React.FC = () => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [selectedTime, setSelectedTime] = useState('12:00');

    const handleSave = async () => { 
        //dissable previous notifications
        try {
            await LocalNotifications.cancel();
        } catch (error) {
            console.error("Error while canceling notifications:", error);
        }

        if(notificationsEnabled){
            // check permissions for notifications
            let permission = await LocalNotifications.checkPermissions();
            if(permission.display !== "granted"){
                permission = await LocalNotifications.requestPermissions();
                if(permission.display !== "granted"){
                    alert("Due to no permissions, no notifications were set.");
                    setNotificationsEnabled(false);
                    return;
                }
            }

            // get notification time
            const currentDate = new Date(Date.now());
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const notificationDate = new Date(currentDate);
            notificationDate.setHours(hours);
            notificationDate.setMinutes(minutes);
            notificationDate.setSeconds(0);

            if (notificationDate < currentDate) {
                notificationDate.setDate(notificationDate.getDate() + 1);
            }

            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: "Erinnerung!",
                        body: "Es ist Zeit für deine geplante Aufgabe.",
                        id: 1,
                        schedule: { 
                            at: notificationDate, 
                            repeats: true
                        },
                        actionTypeId: "",
                        extra: null,
                    }
                ]
            });
            alert('Enabled Notifications! Next: ' + notificationDate);

        } 
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar >
                    <IonTitle id="title-dark">{t("NotifScreen.Title")}</IonTitle>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home/tab4"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
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
                            <IonDatetime className="datetime" presentation="time" value={selectedTime} onIonChange={(e: any) => setSelectedTime(e.detail.value!)} />
                        </IonItem>
                    )}
                </IonList>
                <IonButton color="light" id="save-button" expand="block" onClick={handleSave}>{t("NotifScreen.Button")}</IonButton>

            </IonContent>
        </IonPage>
    );
};

export default NotifScreen;
