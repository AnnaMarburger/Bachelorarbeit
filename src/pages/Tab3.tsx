import { IonCard, IonCardContent, IonCardHeader, IonContent, IonItem, IonList, IonLoading, IonPage, IonSearchbar, IonText, useIonRouter } from '@ionic/react';
import { useTenantApi } from '@api/useTenantApi';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { AppPageDto } from '@api/TenantAPIClient';
import i18next from 'i18next';

import './main.css';
import './Tab3.css';


const Tab3: React.FC = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pages, setPages] = useState<AppPageDto[] | null>([]);
  const [filteredPages, setFilteredPages] = useState<AppPageDto[] | undefined>([]);
  const api = useTenantApi().appPagesApi;


  // set language
  var languageId = "00000000-0000-0000-0000-000000000001";
  if (i18next.language == "de")
    languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

  // route to according info page if a list item was clicked. Shows an error if the page id is faulty
  function routeToInfoPage(pageId: string){
    if (pageId === "" || !pageId) {
      alert(t("QuestionnaireScreen.LoadingError"));
    } else {
      router.push(`/home/tab3/${pageId}`);
    }
  }

  // only show info items whose titles contain the given keyword
  function handleSearch(keyword: string) {
    if(keyword.length==0 || keyword.replace(/\s/g, '').length==0) { 
      setFilteredPages(pages?? []); // reset search if the keyword is empty or only contains spaces
      return;
    }

    let filterResult = pages?.filter(page => page.title.translations[languageId].toLowerCase().includes(keyword.toLowerCase()));
    setFilteredPages(filterResult);
  }

  // get info pages list from api
  async function loadInfos() {
    const projectId = import.meta.env.VITE_HSP_STUDY_IDENTIFIER;
    let response = await api.getAppPages(projectId);
    setPages(response);
    setFilteredPages(response);
  }

  useEffect(() => {
    async function load() {
      try {
        await loadInfos();
       } catch (error) {
        console.error("Error loading informations", error);
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
    <IonPage>
      <IonContent className='ion-content-safe'>
        <IonCard className='ion-no-padding'>
          <IonCardHeader>
            <IonText className='title'>{t("InfoScreen.Title")}</IonText>
          </IonCardHeader>
          <IonCardContent>
            <IonSearchbar className="searchbar" debounce={300} placeholder={t("InfoScreen.Search")} onIonChange={(ev: any) => { handleSearch(ev.detail.value) }}></IonSearchbar>
            <IonList className='instances-list'>{
              filteredPages?.map(page => {
                return <IonItem key={page.id} lines="none" button={true} onClick={() => { routeToInfoPage(page.id) }}>
                  <IonText>{page.title.translations[languageId]} </IonText>
                </IonItem>
              })}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
