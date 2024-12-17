import { IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import './main.css';
import './Tab3.css';
import { chevronForward } from 'ionicons/icons';
import { useTenantApi } from '@api/useTenantApi';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { AppPageDto } from '@api/TenantAPIClient';
import i18next from 'i18next';

const Tab3: React.FC = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pages, setPages] = useState<AppPageDto[] | null>([]);
  const [filteredPages, setFilteredPages] = useState<AppPageDto[] | undefined>([]);


  // set language
  var languageId = "00000000-0000-0000-0000-000000000001";
  if (i18next.language == "de")
    languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";


  // only show info items whose titles contain the given keyword
  function handleSearch(keyword: string) {
    if(keyword.length==0 || keyword.replace(/\s/g, '').length==0) { 
      setFilteredPages(pages?? []);
      return;
    }

    let filterResult = pages?.filter(page => page.title.translations[languageId].toLowerCase().includes(keyword.toLowerCase()));
    console.log(filterResult);
    setFilteredPages(filterResult);
  }

  // get info pages list from api
  async function loadInfos() {
    const projectId = import.meta.env.VITE_HSP_STUDY_IDENTIFIER;
    var api = useTenantApi().appPagesApi;
    var response = await api.getAppPages(projectId);
    console.log(response);
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
            <IonSearchbar className="searchbar" animated={true} debounce={300} placeholder={t("InfoScreen.Search")} onIonChange={(ev: any) => { handleSearch(ev.detail.value) }}></IonSearchbar>
            <IonList className='instances-list'>{
              filteredPages?.map(page => {
                return <IonItem key={page.id} lines="none" button={true} onClick={() => { console.log("todo") }}>
                  <IonText>{page.title.translations[languageId]} </IonText>
                  <IonIcon size="small" className="icon" icon={chevronForward} slot='end'></IonIcon>
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
