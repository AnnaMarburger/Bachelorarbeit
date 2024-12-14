import { IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react';
import './main.css';
import './Tab3.css';
import { t } from 'i18next';
import { chevronForward } from 'ionicons/icons';

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonContent className='ion-content-safe'>
        <IonCard className='ion-no-padding'>
          <IonCardHeader>
            <IonText className='title'>{t("InfoScreen.Title")}</IonText>
          </IonCardHeader>
          <IonCardContent>
            <IonSearchbar className="searchbar" animated={true} debounce={1000} placeholder={t("InfoScreen.Search")}></IonSearchbar>
            <IonList className='instances-list'>
              <IonItem lines="none" button={true} onClick={() => { console.log("todo") }}>
                <IonText> Beispiel 1 </IonText>
                <IonIcon size="small" className="icon" icon={chevronForward} slot='end'></IonIcon>
              </IonItem>
              <IonItem lines="none" button={true} onClick={() => { console.log("todo") }}>
                <IonText> Beispiel 2 </IonText>
                <IonIcon size="small" className="icon" icon={chevronForward} slot='end'></IonIcon>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Tab3;
