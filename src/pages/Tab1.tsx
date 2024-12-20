import { IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonList, IonLoading, IonPage, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { AppPageDto } from '@api/TenantAPIClient';
import { useTenantApi } from '@api/useTenantApi';
import { readActiveAccount } from '../modules/dalAccount';


import './Tab1.css';
import "./main.css";


const Tab1: React.FC = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pages, setPages] = useState<AppPageDto[] | null>([]);
  const account = readActiveAccount();


  // set language
  var languageId = "00000000-0000-0000-0000-000000000001";
  if (i18next.language == "de")
    languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";


  async function loadInfos() {
    const projectId = import.meta.env.VITE_HSP_STUDY_IDENTIFIER;
    let response = await useTenantApi().appPagesApi.getAppPages(projectId);
    setPages(response.slice(0, 3));
  }

  function routeToInfoPage(pageId: string) {
    if (pageId === "" || !pageId) {
      alert(t("QuestionnaireScreen.LoadingError"));
    } else {
      router.push(`/home/tab3/${pageId}`);
    }
  }


  useEffect(() => {
    async function load() {
      try {
        await loadInfos();
      } catch (error) {
        console.error("Error loading data for homescreen", error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  if (isLoading) {
    return (
      <IonLoading isOpen={isLoading} message={t("InfoScreen.Loading")} spinner="crescent"
      />
    );
  }

  return (
    <IonPage className='home-page'>
      <IonContent className='ion-content-safe'>
        <IonCard className='ion-no-padding'>
          <IonCardHeader>
            <IonText className='home-title'>{t("HomeScreen.Title") + (account?.name ? (", " + account.name) : "") + "!"}</IonText>
          </IonCardHeader>
          <IonCardContent>
            <IonCard className='home-card' >
              <IonCardHeader>
                <IonText className='home-subtitle'>{t("HomeScreen.Infos.Title")}</IonText>
              </IonCardHeader>
              <IonCardContent>
                <IonText className='home-text'>{t("HomeScreen.Infos.Description")}</IonText>
                <IonList className='home-list'>
                  {pages?.map(page => {
                    return <IonItem key={page.id} lines="none" button={true} onClick={() => { routeToInfoPage(page.id) }}>
                      <IonText className='home-text'>{page.title.translations[languageId]} </IonText>
                    </IonItem>
                  })
                  }
                </IonList>
              </IonCardContent>
            </IonCard>

            <IonGrid>
              <IonRow>
                <IonCol >
                  <IonCard className='home-card-grid' >
                    <IonCardHeader>
                      <IonText className='home-subtitle'>{t("HomeScreen.Questionnaires.Title")}</IonText>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonText className='home-text'>{t("HomeScreen.Questionnaires.Description")}</IonText>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol>
                  <IonCard className='home-card-grid' >
                    <IonCardHeader>
                      <IonText className='home-subtitle'>{t("HomeScreen.Profile.Title")}</IonText>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonText className='home-text'>{t("HomeScreen.Profile.Description")}</IonText>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonCard className='home-card' >
              <IonCardHeader>
                <IonText className='home-subtitle'>{t("HomeScreen.Stats.Title")}</IonText>
              </IonCardHeader>
              <IonCardContent>
                <IonText className='home-text'>{t("HomeScreen.Stats.Description")}</IonText>
              </IonCardContent>
            </IonCard>
          </IonCardContent>
        </IonCard>
        <div >
          <IonImg src='../public/home.png' className='home-img'></IonImg>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
