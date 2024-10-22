import { IonBadge, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNav, IonNavLink, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import questionnaireExample from '../exampleQuestionnaire.json';
import Questionnaire from '../components/Questionnaire';
import { QuestionnaireInstanceDetailsDtoFromJSON } from '../api/backend-tenant/models/QuestionnaireInstanceDetailsDto';
import { document } from 'ionicons/icons';

const questionnaire1 = QuestionnaireInstanceDetailsDtoFromJSON(questionnaireExample);

const Tab2: React.FC = () => {
  return (
    <IonNav root={() => <QuestionnaireList/>}></IonNav>
  );
};


const QuestionnaireList: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen >
        <IonList inset={true}>
        <IonText className='questionnaireTitle'><h1>Questionnaires</h1></IonText>
          <IonNavLink routerDirection="forward" component={() => <Questionnaire questionnaireInstanz={questionnaire1} />}>
            <IonItem>
              <IonBadge slot="end">{questionnaire1.state}</IonBadge>
              <IonIcon icon={document} slot="start"></IonIcon>
              <IonLabel> Questionnaire 1</IonLabel>
            </IonItem>
          </IonNavLink>
          <IonNavLink routerDirection="forward" component={() => <Questionnaire questionnaireInstanz={questionnaire1} />}>
            <IonItem>
              <IonBadge slot="end">{questionnaire1.state}</IonBadge>
              <IonIcon icon={document} slot="start"></IonIcon>
              <IonLabel> Questionnaire 2</IonLabel>
            </IonItem>
          </IonNavLink>
          <IonNavLink routerDirection="forward" component={() => <Questionnaire questionnaireInstanz={questionnaire1} />}>
            <IonItem>
              <IonBadge slot="end">{questionnaire1.state}</IonBadge>
              <IonIcon icon={document} slot="start"></IonIcon>
              <IonLabel> Questionnaire 3</IonLabel>
            </IonItem>
          </IonNavLink>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;



