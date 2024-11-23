


/*----------------------------------- Imports -----------------------------------------------------------*/

import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonRadio, IonRadioGroup, IonText, IonSegment, IonSegmentButton, IonLabel, IonButton, IonProgressBar, IonIcon, IonChip, IonCol, IonGrid, IonRow, IonFab, IonBackButton, IonFabButton, IonNavLink, useIonViewWillEnter, IonLoading, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import { arrowBack, arrowForward, calendar, close } from 'ionicons/icons';
import { ContentDto, ContentPageDto, ElementType, LikertQuestionDto, QuestionnaireInstanceDetailsDto, QuestionnaireInstanceDto } from "@api/TenantAPIClient";
import { useParams } from "react-router-dom";
import { useTenantApi } from "@api/useTenantApi";
import { LikertQuestion, TextItem, TextQuestion } from "./QuestionnaireItems";

import "../pages/Tab2.css";
import "../pages/main.css";
import "./Questionniare.css"
import i18next from "i18next";

/*----------------------------------- Interfaces -----------------------------------------------------------*/

const componentMap: {
    [key in ElementType]?: React.FC<{ questionItem: any }>
} = {
    [ElementType.LikertQuestion]: LikertQuestion as React.FC<{ questionItem: ContentDto }>,
    [ElementType.RichTextDisplay]: TextItem as React.FC<{ questionItem: ContentDto }>,
    [ElementType.TextQuestion]: TextQuestion as React.FC<{ questionItem: ContentDto }>,

};


interface PageSegment {
    pages: ContentPageDto[];
}

interface ContentFromPage {
    allQuestions: ContentDto[];
}


/*----------------------------------- Funktionen ----------------------------------------------------------------*/

function handleSubmit() {
    //TODO
    console.log("submit button clicked");
}



/*----------------------------------- Funktionskomponenten ------------------------------------------------------*/


//creates a questionnaire feed
const Questionnaire: React.FC = () => {
    const router = useIonRouter();
    const { questionnaireId, instanceId } = useParams<{ questionnaireId: string; instanceId: string }>();
    const [questionnaireInstanz, setQuestionnaireInstanz] = useState<QuestionnaireInstanceDetailsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";


    useEffect(() => {
        async function loadQuestionnaire() {
            if (!questionnaireId || !instanceId) return;
            try {
                const qInstance = await useTenantApi().questionnairesApi.getQuestionnaireInstance(questionnaireId, instanceId);
                console.log(qInstance);
                setQuestionnaireInstanz(qInstance);
            } catch (error) {
                console.error("Error loading questionnaire:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadQuestionnaire();
    }, []);

    if (isLoading) {
        return <IonLoading isOpen={isLoading} message="Fragebogen wird geladen..." />;
    }

    if (!questionnaireInstanz) {
        return <IonText>Fehler: Fragebogen konnte nicht geladen werden.</IonText>;
    }

    return (
        <div className="questionnaire">
            <IonFab slot="fixed" vertical="top" horizontal="end">
                <IonFabButton size="small" onClick={() => {router.push("/home/tab2");}}>
                    <IonIcon icon={close}></IonIcon>
                </IonFabButton>
            </IonFab>
            <div id="questionnaireTitle">
                <IonText>{questionnaireInstanz.questionnaireTitle.translations[languageId]}</IonText>
            </div>
            <IonGrid className="ion-no-padding">
                <IonRow>
                    <IonCol size="auto">
                        <IonChip disabled={true}>
                            <IonIcon icon={calendar}></IonIcon>
                            <IonLabel>{questionnaireInstanz.created?.toDateString()}</IonLabel>
                        </IonChip>
                    </IonCol>
                    <IonCol size="auto">
                        <IonChip disabled={true}>{questionnaireInstanz.state}</IonChip>
                    </IonCol>
                    <IonCol size="auto">
                        <IonChip disabled={true}>{questionnaireInstanz.pages.length} Seiten</IonChip>
                    </IonCol>
                </IonRow>
            </IonGrid>
            <PageSegment pages={questionnaireInstanz.pages} />
        </div>
    );
}

export default Questionnaire;


//creates a segment with a segmentbutton for each page of the questionnaire
const PageSegment: React.FC<PageSegment> = ({ pages }) => {
    const [pageID, setPageID] = useState(0);
    let content = pages[pageID].contents;
    let submitB = <div></div>
    if (pageID == (pages.length - 1)) {
        submitB = <IonButton onClick={handleSubmit}>submit</IonButton>
    }

    return (
        <div>
            <IonButton className="pageButtons" key="forwardB" size="small" shape="round" disabled={(pageID < 1) ? true : false} onClick={() => {
                let newpage = pageID - 1
                if (newpage >= 0) {
                    setPageID(newpage);
                }
            }}> <IonIcon icon={arrowBack} />
            </IonButton>
            <IonButton className="pageButtons" key="backB" size="small" shape="round" disabled={(pageID >= pages.length - 1) ? true : false} onClick={() => {
                let newpage = pageID + 1
                if (newpage < pages.length) {
                    setPageID(newpage);
                }
            }}> <IonIcon icon={arrowForward} />
            </IonButton>
            <IonProgressBar className="progressBar" value={pageID / (pages.length - 1)} />
            <ContentFromPage allQuestions={content}></ContentFromPage>
            {submitB}
        </div>
    );
}


// creates for every entry in "contents", means for every question, a card
const ContentFromPage: React.FC<ContentFromPage> = ({ allQuestions }) => {
    const data = allQuestions.map(quest => {
        const Component = componentMap[quest.elementType];
        if (Component) {
            return <Component questionItem={quest} key={quest.id} />;
        }
        return <p key={quest.id}>Item Type Unknown</p>; // Ignore unknown types
    });

    return <div id="pagecontent">{data}</div>;
}

