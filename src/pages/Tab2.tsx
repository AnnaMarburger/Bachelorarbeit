import { IonCard, IonCardContent, IonCardHeader, IonChip, IonContent, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { calendar, document, documentTextOutline } from 'ionicons/icons';
import { useTenantApi } from '@api/useTenantApi';
import { QuestionnaireDto, QuestionnaireInstanceDto, QuestionnaireInstanceState } from '@api/TenantAPIClient';
import { useTranslation } from 'react-i18next';
import i18next from "i18next";

import './Tab2.css';
import "./main.css";


const Tab2: React.FC = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const [historyList, setHistoryList] = useState<QuestionnaireInstanceDto[] | null>(null);
  const [questionnaireList, setQuestionnaireList] = useState<QuestionnaireDto[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // set language
  var languageId = "00000000-0000-0000-0000-000000000001";
  if (i18next.language == "de")
    languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

  useIonViewWillEnter(() => {
    loadQList(); 
  });

  // route to Questionnaire, that was clicked in the list. Shows the latest unfinished instance or (if that doesn't exist) creates a new one
  async function routeToQuestionnaire(questionnaireId: string) {
    let api = useTenantApi().questionnairesApi;
    let questionnaires = (await (api.getQuestionnaireInstances())).items;
    let latestQ = questionnaires?.filter(entry => entry.questionnaireId == questionnaireId && entry.state !== QuestionnaireInstanceState.Completed).sort((a, b) => a.created > b.created ? -1 : 1)[0];
    if (latestQ == undefined) {
      // there is no unfinished questionnaire instance so there must be created a new one
      await api.createQuestionnaireInstance(questionnaireId);
      questionnaires = (await api.getQuestionnaireInstances()).items;
      setHistoryList(questionnaires);
      latestQ = questionnaires?.filter(entry => entry.questionnaireId == questionnaireId && entry.state !== QuestionnaireInstanceState.Completed).sort((a, b) => a.created > b.created ? -1 : 1)[0];
    }

    let instanceId = latestQ?.id;
    if (instanceId == undefined) {
      alert(t("QuestionnaireScreen.LoadingError")); // an error occured in the previous actions
    } else {
      router.push(`/home/tab2/${questionnaireId}/${instanceId}/edit`);
    }
  }

  // get questionnaires list from api
  async function loadQList() {
    try {
      let questionnaires = (await useTenantApi().questionnairesApi.getQuestionnaires()).items
      setQuestionnaireList(questionnaires);
      let history = (await useTenantApi().questionnairesApi.getQuestionnaireInstances()).items;
      setHistoryList(history);
    } catch (error) {
      console.error("Error loading questionnaires", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadQList();
  }, []);

  if (isLoading) {
    return (
      <IonLoading isOpen={isLoading} message={t("QOverviewScreen.Loading")} spinner="crescent" />
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
              {questionnaireList?.map(elem => {
                return <IonItem key={elem.id} lines="none" button={true} onClick={() => { routeToQuestionnaire(elem.id) }}>
                  <IonIcon className="icon" icon={document} slot="start"></IonIcon>
                  <IonText> {elem.title.translations[languageId]} </IonText>
                </IonItem>
              })}
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
              {historyList?.sort((a, b) => a.created > b.created ? -1 : 1).map(elem => {
                return <IonItem key={elem.id} lines="none" button={true} onClick={() => {
                   router.push(`/home/tab2/${elem.questionnaireId}/${elem.id}/view`); 
                   }}>
                  <IonIcon aria-hidden="true" color="light" icon={documentTextOutline} slot="start" />
                  <IonLabel className="label"> {elem.questionnaireName} </IonLabel>
                  <IonChip disabled={true}>
                    <IonIcon icon={calendar}></IonIcon>
                    <IonLabel>{elem.completed?.toLocaleDateString(i18next.language) ?? t("QOverviewScreen.DatumChip")}</IonLabel>
                  </IonChip>
                </IonItem>
              })}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};


export default Tab2;



