/*----------------------------------- Imports -----------------------------------------------------------*/

import { IonText, IonLabel, IonButton, IonProgressBar, IonIcon, IonChip, IonCol, IonGrid, IonRow, IonFab, IonFabButton, IonLoading, useIonRouter, IonPage, useIonToast, IonContent, IonHeader, IonButtons, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import { arrowBack, arrowForward, calendar, close } from 'ionicons/icons';
import { AnswerDto, ContentDto, ContentPageDto, ElementType, QuestionnaireInstanceDetailsDto, UpdateQuestionnaireInstanceCommand } from "@api/TenantAPIClient";
import { useParams } from "react-router-dom";
import { useTenantApi } from "@api/useTenantApi";
import { ChoiceQuestion, HeaderItem, LikertQuestion, NumberQuestion, SliderQuestion, TextItem, TextQuestion } from "./QuestionnaireItems";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import "../pages/Tab2.css";
import "../pages/main.css";
import "./Questionniare.css"

/*----------------------------------- Constants -----------------------------------------------------------*/
const componentMap: {
    [key in ElementType]?: React.FC<{ questionItem: any, onAnswerChange: (questionId: string, answer: any) => void, answer: AnswerDto | null, viewOnly: boolean }>
} = {
    [ElementType.LikertQuestion]: LikertQuestion as React.FC<{ questionItem: ContentDto }>,
    [ElementType.ChoiceQuestion]: ChoiceQuestion as React.FC<{ questionItem: ContentDto }>,
    [ElementType.RichTextDisplay]: TextItem as React.FC<{ questionItem: ContentDto }>,
    [ElementType.TextDisplay]: HeaderItem as React.FC<{ questionItem: ContentDto }>,
    [ElementType.TextQuestion]: TextQuestion as React.FC<{ questionItem: ContentDto }>,
    [ElementType.NumberQuestion]: NumberQuestion as React.FC<{ questionItem: ContentDto }>,
    [ElementType.SliderQuestion]: SliderQuestion as React.FC<{ questionItem: ContentDto }>,
};

/*----------------------------------- Interfaces -----------------------------------------------------------*/

interface PageSegment {
    pages: ContentPageDto[];
    pageId: number;
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
    onSubmit: () => void;
    answers: { [questionId: string]: AnswerDto | null };
    viewOnly: boolean;
}


/*----------------------------------- Pagecomponents ------------------------------------------------------*/

const Questionnaire: React.FC = () => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const [present] = useIonToast();
    const { questionnaireId, instanceId, viewOnly } = useParams<{ questionnaireId: string; instanceId: string; viewOnly: string }>();
    const [questionnaireInstanz, setQuestionnaireInstanz] = useState<QuestionnaireInstanceDetailsDto | null>(null);
    const [answers, setAnswers] = useState<{ [questionId: string]: AnswerDto | null }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [pageID, setPageID] = useState(0);

    const started = new Date();

    //get current language of client
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

    const handleAnswerChange = (questionId: string, answer: AnswerDto | null) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        //check if every *required* question is answered*
        var completed = true;
        var questionCount = 0;
        questionnaireInstanz?.pages.forEach(page => {
            page.contents.forEach(elem => {
                if (elem.elementType.includes("Question"))
                    questionCount += 1;
            })
        })
        console.log(questionCount);
        if (Object.values(answers).length < questionCount)
            completed = false;

        const command = new UpdateQuestionnaireInstanceCommand();
        command.questionnaireId = questionnaireId;
        command.questionnaireInstanceId = instanceId;
        command.answers = Object.values(answers).filter(answer => answer !== null);
        command.completed = completed ? new Date() : undefined;
        command.executionLanguageId = languageId;
        if (questionnaireInstanz?.started == undefined)
            command.started = started;
        console.log("Submitting these answers:", command);

        useTenantApi().questionnairesApi.updateQuestionnaireInstance(questionnaireId, instanceId, command)
            .then(() => {
                console.log("Successfully sent to server");
                present({
                    message: t("QuestionnaireScreen.AlertSuccess"),
                    duration: 2000,
                    position: "top",
                });
                router.push("/home/tab2", "back");
            })
            .catch(error => console.error("Error sending answers:", error));
    };


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
        return <IonLoading isOpen={isLoading} message={t("QuestionnaireScreen.Loading")} />;
    }

    if (!questionnaireInstanz) {
        return <IonText>Fehler: Fragebogen konnte nicht geladen werden.</IonText>;
    }

    return (
        <IonPage className="light-background">
            <IonHeader translucent={false} className="ion-no-border" id="header">
                <IonToolbar className="light-background">
                    <IonText id="questionnaireTitle" className="ion-no-padding">{questionnaireInstanz.questionnaireTitle.translations[languageId]}</IonText>
                    <IonButtons slot="end">
                        <IonButton onClick={() => { router.push("/home/tab2", "back"); }}>
                            <IonIcon icon={close}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonGrid id="chip-grid" className="ion-no-padding">
                    <IonRow>
                        <IonCol size="auto">
                            <IonChip disabled={true}>
                                <IonIcon icon={calendar}></IonIcon>
                                <IonLabel>{questionnaireInstanz.created?.toLocaleDateString(i18next.language)}</IonLabel>
                            </IonChip>
                        </IonCol>
                        <IonCol size="auto">
                            <IonChip disabled={true}>{questionnaireInstanz.pages.length} {t("QuestionnaireScreen.Pages")}</IonChip>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonButton className="pageButtons" key="forwardB" size="small" shape="round" disabled={(pageID < 1) ? true : false} onClick={() => {
                    let newpage = pageID - 1
                    if (newpage >= 0) {
                        setPageID(newpage);
                    }
                }}> <IonIcon icon={arrowBack} />
                </IonButton>
                <IonButton className="pageButtons" key="backB" size="small" shape="round" disabled={(pageID >= questionnaireInstanz.pages.length - 1) ? true : false} onClick={() => {
                    let newpage = pageID + 1
                    if (newpage < questionnaireInstanz.pages.length) {
                        setPageID(newpage);
                    }
                }}> <IonIcon icon={arrowForward} />
                </IonButton>
                <IonProgressBar className="progressBar" value={pageID / (questionnaireInstanz.pages.length - 1)} />
            </IonHeader>
            <IonContent className="light-background">
                <PageSegment
                    pages={questionnaireInstanz.pages}
                    pageId={pageID}
                    onAnswerChange={handleAnswerChange}
                    onSubmit={handleSubmit} answers={answers}
                    viewOnly={viewOnly === "view"}
                />
            </IonContent>
        </IonPage>
    );
}



const PageSegment: React.FC<PageSegment> = ({ pages, pageId, onAnswerChange, onSubmit, answers, viewOnly }) => {
    const { t } = useTranslation();
    let content = pages[pageId].contents;
    const data = content.map(quest => {
        const Component = componentMap[quest.elementType];
        if (Component) {
            return <Component questionItem={quest} key={quest.id} onAnswerChange={onAnswerChange} answer={answers[quest.id] || null} viewOnly={viewOnly} />;
        }
        return <p key={quest.id}>Item Type Unknown</p>; //DEBUG
    });


    return (
        <div id="pagecontent">
            {data}
            <div className="center">{(pageId === pages.length - 1 && !viewOnly) ? (
                <IonButton id="submitB" onClick={onSubmit}>{t("QuestionnaireScreen.Button")}</IonButton>
            ) : null}
            </div>
        </div>
    );
}


export default Questionnaire;
