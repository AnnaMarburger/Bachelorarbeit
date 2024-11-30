import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonChip, IonContent, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { calendar, document } from 'ionicons/icons';
import { useTenantApi } from '@api/useTenantApi';
import { QuestionnaireInstanceDto, QuestionnaireInstanceState } from '@api/TenantAPIClient';

import './Tab2.css';
import "./main.css";

const Tab2: React.FC = () => {
  const router = useIonRouter();
  const [questionnaireList, setQuestionnaireList] = useState<QuestionnaireInstanceDto[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  var history = questionnaireList?.map(elem => {
    return <IonItem key={elem.id} lines="none" button={true} onClick={() => { console.log("todo"); }}>
      <IonLabel className="label"> {elem.questionnaireName} </IonLabel>
      <IonChip disabled={true}>
        <IonIcon icon={calendar}></IonIcon>
        <IonLabel>{elem.completed?.toDateString() ?? "Pending"}</IonLabel>
      </IonChip>

    </IonItem>
  })

  async function routeToQuestionnaire(questionnaireId: string) {
    const latestQ = questionnaireList?.filter(entry => entry.questionnaireId == questionnaireId && entry.state !== QuestionnaireInstanceState.Completed).sort((a, b) => a.created > b.created ? 1 : -1)[questionnaireList.length - 1];
    let instanceId = latestQ?.id;
    if (!instanceId) {
      instanceId = await useTenantApi().questionnairesApi.createQuestionnaireInstance(questionnaireId);
    }
    router.push(`/home/tab2/${questionnaireId}/${instanceId}`);
  }


  useEffect(() => {
    async function loadQList() {
      console.log("Loading questionnaires..."); // Debug
      try {
        var questionnaires = (await useTenantApi().questionnairesApi.getQuestionnaireInstances()).items;
        if (questionnaires.length < 1) {
          console.log("keine Inhalte. Creating new Instance...");
          await useTenantApi().questionnairesApi.createQuestionnaireInstance("97ad904e-9cb9-4047-a125-d064a8cd4bcf");
          questionnaires = (await useTenantApi().questionnairesApi.getQuestionnaireInstances()).items;
          setQuestionnaireList(questionnaires);
        } else {
          setQuestionnaireList(questionnaires);
        }
        console.log(questionnaires);
      } catch (error) {
        console.error("Error loading questionnaire", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadQList();
  }, []);

  if (isLoading) {
    return (
      <IonLoading isOpen={isLoading} message="Lädt Fragebögen..." spinner="crescent"
      />
    );
  }

  if (!questionnaireList) {
    return <IonText>Fehler: Fragebogen konnte nicht geladen werden.</IonText>;
  }

  return (
    <IonPage className='content'>
      <IonContent className='ion-padding'>
        <IonCard className='card'>
          <IonCardHeader>
            <IonText className='title'>Questionnaires</IonText>
          </IonCardHeader>
          <IonCardContent>
            <IonText className="blocktext"> Click on the following Items to answer a new Questionnaire. </IonText>
            <IonList className='instances-list'>
              <IonItem lines="none" button={true} onClick={() => { routeToQuestionnaire("97ad904e-9cb9-4047-a125-d064a8cd4bcf") }}>
                <IonIcon className="icon" icon={document} slot="start"></IonIcon>
                <IonText className="label"> SDQ </IonText>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonCard className='card'>
          <IonCardHeader>
            <IonText className='title'>History</IonText>
          </IonCardHeader>
          <IonCardContent>
          <IonText className="blocktext"> Take a look at your previously answered Questionnaires. </IonText>
            <IonList className='instances-list'>
              {history}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};


export default Tab2;



