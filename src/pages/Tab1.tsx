import {IonContent, IonHeader, IonPage,IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tab1.css';

const Tab1: React.FC = () => {
  useIonViewWillEnter(() => {
    console.log("about to enter tab 1");
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
