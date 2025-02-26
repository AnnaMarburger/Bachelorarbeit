import { LocalNotifications } from "@capacitor/local-notifications";
import { IonPage, IonContent, IonButton, IonDatetime, IonHeader, IonItem, IonLabel, IonTitle, IonToggle, IonToolbar, IonButtons, IonList, IonBackButton } from "@ionic/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Preferences } from '@capacitor/preferences';

import "../Tab4.css";
import "../main.css"

// screen to display notification settings
const NotifScreen: React.FC = () => {
    const { t } = useTranslation();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [selectedTime, setSelectedTime] = useState('12:00');

    useEffect(() => {
        // load previously set notification settings from storage
        async function load() {
            try {
                const { value } = await Preferences.get({ key: 'NotifTime' });
                if (value) {
                    setNotificationsEnabled(true);
                    setSelectedTime(value);
                }
            } catch (error) {
                console.error("Error loading notif preferences", error);
            }
        }

        load();
    }, []);

    // save notification settings
    async function handleSave() {
        //disable previous notifications
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
            await LocalNotifications.cancel({ notifications: pending.notifications });
        }

        if (notificationsEnabled) {
            // check permissions for notifications
            let permission = await LocalNotifications.checkPermissions();
            if (permission.display !== "granted") {
                permission = await LocalNotifications.requestPermissions(); // request permissions again
                if (permission.display !== "granted") {
                    alert(t("NotifScreen.AlertAccessFail"));
                    setNotificationsEnabled(false);
                    return;
                }
            }

            // schedule
            const [hours, minutes] = selectedTime.split(':').map(Number);
            var notifDate = new Date();
            notifDate.setHours(hours, minutes, 0, 0);
            if (notifDate < new Date()) {
                notifDate.setDate(notifDate.getDate() + 1);
            }
            const result = await LocalNotifications.schedule({
                notifications: [
                    {
                        title: t("NotifScreen.NotifTitle"),
                        body: t("NotifScreen.NotifBody"),
                        id: 1,
                        schedule: {
                            at: notifDate,
                            repeats: true,
                            every: "day"
                        },
                        actionTypeId: "",
                        extra: null,
                    }
                ]
            });

            // safe to storage
            await Preferences.set({
                key: 'NotifTime',
                value: selectedTime,
            });

            alert(t("NotifScreen.AlertSuccess"));
        } else {
            await Preferences.remove({key: 'NotifTime'});
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
                <IonButton color="light" id="save-button" expand="block" onClick={() => handleSave()}>{t("NotifScreen.Button")}</IonButton>

            </IonContent>
        </IonPage>
    );
};

export default NotifScreen;
