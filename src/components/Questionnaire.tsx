/*----------------------------------- Imports -----------------------------------------------------------*/

import {  IonText, IonLabel, IonButton, IonProgressBar, IonIcon, IonChip, IonCol, IonGrid, IonRow, IonFab, IonFabButton, IonLoading, useIonRouter, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { arrowBack, arrowForward, calendar, close } from 'ionicons/icons';
import { AnswerDto, ContentDto, ContentPageDto, ElementType, QuestionnaireInstanceDetailsDto, UpdateQuestionnaireInstanceCommand } from "@api/TenantAPIClient";
import { useParams } from "react-router-dom";
import { useTenantApi } from "@api/useTenantApi";
import { LikertQuestion, TextItem, TextQuestion } from "./QuestionnaireItems";
import i18next from "i18next";

import "../pages/Tab2.css";
import "../pages/main.css";
import "./Questionniare.css"
import { useTranslation } from "react-i18next";


/*----------------------------------- Constants -----------------------------------------------------------*/
const componentMap: {
    [key in ElementType]?: React.FC<{ questionItem: any, onAnswerChange: (questionId: string, answer: any) => void, answer: AnswerDto | null}>
} = {
    [ElementType.LikertQuestion]: LikertQuestion as React.FC<{ questionItem: ContentDto }>,
    [ElementType.RichTextDisplay]: TextItem as React.FC<{ questionItem: ContentDto }>,
    [ElementType.TextQuestion]: TextQuestion as React.FC<{ questionItem: ContentDto }>,

};

/*----------------------------------- Interfaces -----------------------------------------------------------*/

interface PageSegment {
    pages: ContentPageDto[];
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
    onSubmit: () => void;
    answers: { [questionId: string]: AnswerDto | null };
}


/*----------------------------------- Funktionskomponenten ------------------------------------------------------*/

const Questionnaire: React.FC = () => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const { questionnaireId, instanceId } = useParams<{ questionnaireId: string; instanceId: string }>();
    const [questionnaireInstanz, setQuestionnaireInstanz] = useState<QuestionnaireInstanceDetailsDto | null>(null);
    const [answers, setAnswers] = useState<{ [questionId: string]: AnswerDto | null}>({});
    const [isLoading, setIsLoading] = useState(true);
    const started = new Date();

    //get current language of client
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

    const handleAnswerChange = (questionId: string, answer: AnswerDto | null) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        console.log("Changed Answers:", answers);
    };

    const handleSubmit = () => {
        //check if every *required* question is answered*
        var completed = true;
        if(Object.values(answers).find(answer => answer == null))
            completed = false;

        const command = new UpdateQuestionnaireInstanceCommand();
        command.questionnaireId = questionnaireId;
        command.questionnaireInstanceId = instanceId;
        command.answers = Object.values(answers).filter(answer => answer !== null);
        command.completed = completed ? new Date() : undefined;
        command.executionLanguageId = languageId;
        if (!questionnaireInstanz?.started)
            command.started = started;
        console.log("Submitting these answers:", command);

        useTenantApi().questionnairesApi.updateQuestionnaireInstance(questionnaireId, instanceId, command)
            .then(() => {
                console.log("Successfully sent to server");
                alert(t("QuestionnaireScreen.AlertSuccess"));
                //router.push("home/tab2");
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
        return <IonLoading isOpen={isLoading} message="Fragebogen wird geladen..." />;
    }

    if (!questionnaireInstanz) {
        return <IonText>Fehler: Fragebogen konnte nicht geladen werden.</IonText>;
    }

    return (
        <IonPage>
            <div className="questionnaire">
                <IonFab slot="fixed" vertical="top" horizontal="end">
                    <IonFabButton size="small" onClick={() => { router.push("/home/tab2"); }}>
                        <IonIcon icon={close}></IonIcon>
                    </IonFabButton>
                </IonFab>
                <div id="questionnaireTitle" slot="fixed">
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
                <PageSegment pages={questionnaireInstanz.pages} onAnswerChange={handleAnswerChange} onSubmit={handleSubmit} answers={answers}/>
            </div>
        </IonPage>
    );
}



const PageSegment: React.FC<PageSegment> = ({ pages, onAnswerChange, onSubmit, answers }) => {
    const { t } = useTranslation();

    const [pageID, setPageID] = useState(0);
    let content = pages[pageID].contents;
    const data = content.map(quest => {
        const Component = componentMap[quest.elementType];
        if (Component) {
            return <Component questionItem={quest} key={quest.id} onAnswerChange={onAnswerChange} answer={answers[quest.id] || null}/>;
        }
        return <p key={quest.id}>Item Type Unknown</p>; //DEBUG
    });


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
            <div id="pagecontent" className=" ion-content">
                {data}
                <div className="center">{pageID === pages.length - 1 ? (
                    <IonButton id="submitB" onClick={onSubmit}>{t("QuestionnaireScreen.Button")}</IonButton>
                ) : null}
                </div>
            </div>

        </div>
    );
}


export default Questionnaire;
