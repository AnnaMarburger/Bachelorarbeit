import { IonBadge, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonNav, IonNavLink, IonPage, IonText, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import Questionnaire from '../components/Questionnaire';
import { document } from 'ionicons/icons';
import { useTenantApi } from '@api/useTenantApi';

import './Tab2.css';
import "./main.css";
import { QuestionnaireInstanceDto, QuestionnaireInstanceState } from '@api/TenantAPIClient';

const Tab2: React.FC = () => {
  const router = useIonRouter();
  const [questionnaireList, setQuestionnaireList] = useState<QuestionnaireInstanceDto[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  async function routeToQuestionnaire(questionnaireId: string) {
    const latestQ = questionnaireList?.filter(entry => entry.questionnaireId == questionnaireId && entry.state !== QuestionnaireInstanceState.Completed).sort((a, b) => a.created > b.created ? 1 : -1)[questionnaireList.length - 1];
    let instanceId = latestQ?.id;
    if (!instanceId) {
      instanceId = await useTenantApi().questionnairesApi.createQuestionnaireInstance(questionnaireId);
    }
    router.push(`/home/tab2/${questionnaireId}/${instanceId}`);
  }

  async function loadQList() {
    console.log("Loading questionnaires..."); // Debug
    try {
      let questionnaires = (await useTenantApi().questionnairesApi.getQuestionnaireInstances()).items;
      console.log(questionnaires);
      if (questionnaires.length < 1) {
        console.log("keine Inhalte. Creating new Instance...");
        const answer = await useTenantApi().questionnairesApi.createQuestionnaireInstance("97ad904e-9cb9-4047-a125-d064a8cd4bcf");
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


  useEffect(() => {
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
    <IonPage>
      <IonContent fullscreen >
        <IonList inset={true}>
          <IonText className='questionnaireTitle'><h1>Questionnaires</h1></IonText>
          <IonItem button={true} onClick={() => { routeToQuestionnaire("97ad904e-9cb9-4047-a125-d064a8cd4bcf") }}>
            <IonBadge slot="end">{questionnaireList ? questionnaireList[0].state : ""}</IonBadge>
            <IonIcon className="icon" icon={document} slot="start"></IonIcon>
            <IonLabel className="label"> SDQ </IonLabel>
          </IonItem>

        </IonList>
      </IonContent>
    </IonPage>
  );
};


export default Tab2;



