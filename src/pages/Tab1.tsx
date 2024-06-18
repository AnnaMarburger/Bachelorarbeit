import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';

const Tab1: React.FC = () => {
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
        <IonSearchbar class='custom'></IonSearchbar>
        <IonGrid>
               
            </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
