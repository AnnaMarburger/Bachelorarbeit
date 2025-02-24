import { ElementType, ContentDto, AppPageDto } from "@api/TenantAPIClient";
import { useTenantApi } from "@api/useTenantApi";
import { HeaderItem, ImageItem, TextItem } from "@components/InfopageItems";
import { useIonRouter, IonLoading, IonText, IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonTitle } from "@ionic/react";
import i18next from "i18next";
import { close } from 'ionicons/icons';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import "../main.css"
import "./InfoPage.css"

/*----------------------------------- Constants -----------------------------------------------------------*/
const componentMap: {
    [key in ElementType]?: React.FC<{ contentItem: any }>
} = {
    [ElementType.RichTextDisplay]: TextItem as React.FC<{ contentItem: ContentDto }>,
    [ElementType.TextDisplay]: HeaderItem as React.FC<{ contentItem: ContentDto }>,
    [ElementType.ImageDisplay]: ImageItem as React.FC<{ contentItem: ContentDto }>
};


/*----------------------------------- page components ------------------------------------------------------*/

const InfoPage: React.FC = () => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const { pageId } = useParams<{ pageId: string }>();
    const [pageInstance, setPageInstance] = useState<AppPageDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    //get current language of client
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

    useEffect(() => {
        async function loadQuestionnaire() {
            if (!pageId) return;
            try {
                let result = await useTenantApi().appPagesApi.getAppPage(pageId);
                console.log(result);
                setPageInstance(result);
            } catch (error) {
                console.error("Error loading page:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadQuestionnaire();
    }, []);


    if (isLoading) {
        return <IonLoading isOpen={isLoading} message={t("QuestionnaireScreen.Loading")} />;
    }

    if (pageInstance == null) {
        return <IonText>Error: Questionnaire could not be loaded.</IonText>;
    }

    return (
        <IonPage className="light-background">
            <IonHeader translucent={false} className="ion-no-border" id="infoPage-header">
                <IonToolbar>
                    <IonTitle id="infoPage-title">{pageInstance.title.translations[languageId]}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => { router.push("/home/tab3", "back"); }}>
                            <IonIcon icon={close}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="infoContent">
                {
                    pageInstance.contents.map(item => {
                        let Component = componentMap[item.elementType];
                        if (Component) {
                            return <Component contentItem={item} key={item.id} />;
                        }
                        return <p key={item.id}>Item Type Unknown</p>;
                    })
                }
            </IonContent>
        </IonPage>
    );
}

export default InfoPage;