import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonChip, IonContent, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { calendar, document, documentTextOutline } from 'ionicons/icons';
import { useTenantApi } from '@api/useTenantApi';
import { QuestionnaireInstanceDto, QuestionnaireInstanceState } from '@api/TenantAPIClient';
import { useTranslation } from 'react-i18next';
import i18next from "i18next";

import './Tab2.css';
import "./main.css";


const Tab2: React.FC = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const [questionnaireList, setQuestionnaireList] = useState<QuestionnaireInstanceDto[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // build list of items for questionnaire instance, that the user created up to this point
  var history = questionnaireList?.sort((a, b) => a.created > b.created ? -1 : 1).map(elem => {
    return <IonItem key={elem.id} lines="none" button={true} onClick={() => { router.push(`/home/tab2/${elem.questionnaireId}/${elem.id}/view`); }}>
      <IonIcon aria-hidden="true" color="light" icon={documentTextOutline} slot="start" />
      <IonLabel className="label"> {elem.questionnaireName} </IonLabel>
      <IonChip disabled={true}>
        <IonIcon icon={calendar}></IonIcon>
        <IonLabel>{elem.completed?.toLocaleDateString(i18next.language) ?? t("QOverviewScreen.DatumChip")}</IonLabel>
      </IonChip>

    </IonItem>
  })

  // route to Questionnaire, that was clicked in the list. Shows the latest unfinished instance or (if that doesn't exist) creates a new one
  async function routeToQuestionnaire(questionnaireId: string) {
    var api = useTenantApi().questionnairesApi;
    var questionnaires = (await (api.getQuestionnaireInstances())).items;
    var latestQ = questionnaires?.filter(entry => entry.questionnaireId == questionnaireId && entry.state !== QuestionnaireInstanceState.Completed).sort((a, b) => a.created > b.created ? -1 : 1)[0];
    if (latestQ == undefined) {
      api.createQuestionnaireInstance(questionnaireId);
      questionnaires = (await api.getQuestionnaireInstances()).items;
      setQuestionnaireList(questionnaires);
      latestQ = questionnaires?.filter(entry => entry.questionnaireId == questionnaireId && entry.state !== QuestionnaireInstanceState.Completed).sort((a, b) => a.created > b.created ? -1 : 1)[0];
    }

    var instanceId = latestQ?.id;
    if(instanceId == undefined){
      alert(t("QuestionnaireScreen.LoadingError"));
    } else {
      router.push(`/home/tab2/${questionnaireId}/${instanceId}/edit`);
    }
  }

  // get questionnaires list from api
  useEffect(() => {
    async function loadQList(){
      console.log("Loading questionnaires..."); // Debug
      try {
        var questionnaires = (await useTenantApi().questionnairesApi.getQuestionnaireInstances()).items;
        setQuestionnaireList(questionnaires);
        console.log(questionnaires);
      } catch (error) {
        console.error("Error loading questionnaire", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadQList();
  }, []);

  if(isLoading){
    return (
      <IonLoading isOpen={isLoading} message={t("QOverviewScreen.Loading")} spinner="crescent"/>
    );
  }

  return (
    <IonPage>
      <IonContent className='ion-content-safe'>
        <IonCard className='ion-no-padding'>
          <IonCardHeader>
            <IonText className='title'>{t("QOverviewScreen.TitleQs")}</IonText>
          </IonCardHeader>
          <IonCardContent>
            <IonText className="blocktext"> {t("QOverviewScreen.TextQs")} </IonText>
            <IonList className='instances-list'>
              <IonItem lines="none" button={true} onClick={() => { routeToQuestionnaire("97ad904e-9cb9-4047-a125-d064a8cd4bcf") }}>
                <IonIcon className="icon" icon={document} slot="start"></IonIcon>
                <IonText> SDQ </IonText>
              </IonItem>
              <IonItem lines="none" button={true} onClick={() => { routeToQuestionnaire("f6766393-117b-4006-9705-09ca2f1cb458") }}>
                <IonIcon className="icon" icon={document} slot="start"></IonIcon>
                <IonText> PREDIMED </IonText>
              </IonItem>
              <IonItem lines="none" button={true} onClick={() => { routeToQuestionnaire("61266358-7155-46df-b0f2-fbf4bedc7e9f") }}>
                <IonIcon className="icon" icon={document} slot="start"></IonIcon>
                <IonText> IPAQ </IonText>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonCard className='ion-no-padding'>
          <IonCardHeader>
            <IonText className='title'>{t("QOverviewScreen.TitleH")}</IonText>
          </IonCardHeader>
          <IonCardContent>
            <IonText className="blocktext"> {t("QOverviewScreen.TextH")} </IonText>
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



