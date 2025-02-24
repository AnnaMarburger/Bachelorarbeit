/*----------------------------------- Imports -----------------------------------------------------------*/

import { IonText, IonLabel, IonButton, IonProgressBar, IonIcon, IonChip, IonCol, IonGrid, IonRow, IonLoading, useIonRouter, IonPage, useIonToast, IonContent, IonHeader, IonButtons, IonToolbar } from "@ionic/react";
import { ChoiceQuestion, HeaderItem, LikertQuestion, NumberQuestion, SliderQuestion, TextItem, TextQuestion } from "@components/QuestionnaireItems";
import { evaluateQuestionnaire } from "@components/Evaluation";
import { AnswerDto, ChoiceQuestionDto, ContentDto, ContentPageDto, ElementType, LikertQuestionDto, NumberQuestionDto, QuestionnaireInstanceDetailsDto, SliderQuestionDto, TextQuestionDto, UpdateQuestionnaireInstanceCommand } from "@api/TenantAPIClient";
import { useEffect, useState } from "react";
import { arrowBack, arrowForward, calendar, close } from 'ionicons/icons';
import { useParams } from "react-router-dom";
import { useTenantApi } from "@api/useTenantApi";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import "../Tab2.css";
import "../main.css";
import "./Questionniare.css"

/*-------------------------------------- Map -------------------------------------------------------------*/
const componentMap: {
    [key in ElementType]?: React.FC<{
        questionItem: any,
        onAnswerChange: (questionId: string, answer: any) => void,
        answer: AnswerDto | null,
        viewOnly: boolean
    }>
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

/*----------------------------------- Functions -----------------------------------------------------------*/


function isQuestionWithAnswer(item: ContentDto): item is ChoiceQuestionDto | NumberQuestionDto | LikertQuestionDto | TextQuestionDto | SliderQuestionDto {
    return (
        'answer' in item &&
        typeof (item as any).answer !== 'undefined'
    );
}


/*----------------------------------- Page Components -----------------------------------------------------*/

const Questionnaire: React.FC = () => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const [present] = useIonToast();
    const { questionnaireId, instanceId, viewOnly } = useParams<{ questionnaireId: string; instanceId: string; viewOnly: string }>();
    const [questionnaireInstance, setQuestionnaireInstance] = useState<QuestionnaireInstanceDetailsDto | null>(null);
    const [answers, setAnswers] = useState<{ [questionId: string]: AnswerDto | null }>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pageID, setPageID] = useState<number>(0);

    const started = new Date();

    // get current language of client
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

    const handleAnswerChange = (questionId: string, answer: AnswerDto | null) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    // submit all answers to the server. Routes to Tab 2 if successful
    const handleSubmit = () => {
        // check if every question is answered and mark the questionnaire as completed if so
        var completed = true;
        var questionCount = 0;
        questionnaireInstance?.pages.forEach(page => {
            page.contents.forEach(elem => {
                if (elem.elementType.includes("Question"))
                    questionCount += 1;
            })
        })
        if (Object.values(answers).length < questionCount)
            completed = false;

        // build update command
        const command = new UpdateQuestionnaireInstanceCommand();
        command.questionnaireId = questionnaireId;
        command.questionnaireInstanceId = instanceId;
        command.answers = Object.values(answers).filter(answer => answer !== null);
        command.completed = completed ? new Date() : undefined;
        command.executionLanguageId = languageId;
        if (questionnaireInstance?.started == undefined)
            command.started = started;

        // send to server and notify user with a toast if submission was successful
        useTenantApi().questionnairesApi.updateQuestionnaireInstance(questionnaireId, instanceId, command)
            .then(() => {
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
                setQuestionnaireInstance(qInstance);

                // set initial answers
                const initialAnswers = qInstance.pages
                    .flatMap(page => page.contents)
                    .filter(isQuestionWithAnswer)
                    .reduce((acc, item) => {
                        acc[item.id] = item.answer ?? null;
                        return acc;
                    }, {} as { [questionId: string]: AnswerDto | null });

                setAnswers(initialAnswers);

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

    if (!questionnaireInstance) {
        return <IonText>Error loading Questionnaire</IonText>;
    }

    return (
        <IonPage className="light-background">
            <IonHeader translucent={false} className="ion-no-border" id="header">
                <IonToolbar className="light-background">
                    <IonText id="questionnaireTitle" className="ion-no-padding">{questionnaireInstance.questionnaireTitle.translations[languageId]}</IonText>
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
                                <IonLabel>{questionnaireInstance.created?.toLocaleDateString(i18next.language)}</IonLabel>
                            </IonChip>
                        </IonCol>
                        <IonCol size="auto">
                            <IonChip disabled={true}>{questionnaireInstance.pages.length} {t("QuestionnaireScreen.Pages")}</IonChip>
                        </IonCol>
                        {(viewOnly === "view" && questionnaireInstance.completed) && (
                            <IonCol size="auto">
                                <IonChip disabled={true}>{t("QuestionnaireScreen.Score")} {evaluateQuestionnaire(questionnaireInstance)} </IonChip>
                            </IonCol>
                        )}
                    </IonRow>
                </IonGrid>
                <IonButton className="pageButtons" key="forwardB" size="small" shape="round" disabled={(pageID < 1) ? true : false} onClick={() => {
                    let newpage = pageID - 1
                    if (newpage >= 0) {
                        setPageID(newpage);
                    }
                }}> <IonIcon icon={arrowBack} />
                </IonButton>
                <IonButton className="pageButtons" key="backB" size="small" shape="round" disabled={(pageID >= questionnaireInstance.pages.length - 1) ? true : false} onClick={() => {
                    let newpage = pageID + 1
                    if (newpage < questionnaireInstance.pages.length) {
                        setPageID(newpage);
                    }
                }}> <IonIcon icon={arrowForward} />
                </IonButton>
                <IonProgressBar className="progressBar" value={pageID / (questionnaireInstance.pages.length - 1)} />
            </IonHeader>
            <IonContent className="light-background">
                <PageSegment
                    pages={questionnaireInstance.pages}
                    pageId={pageID}
                    onAnswerChange={handleAnswerChange}
                    onSubmit={handleSubmit}
                    answers={answers}
                    viewOnly={viewOnly === "view"}
                />
            </IonContent>
        </IonPage>
    );
}



const PageSegment: React.FC<PageSegment> = ({ pages, pageId, onAnswerChange, onSubmit, answers, viewOnly }) => {
    const { t } = useTranslation();
    let content = pages[pageId].contents;

    // map questionnaire item data from server to questionnaire items
    const data = content.map(quest => {
        const Component = componentMap[quest.elementType];
        if (Component) {
            return <Component questionItem={quest} key={quest.id} onAnswerChange={onAnswerChange}
                answer={answers[quest.id] || null} viewOnly={viewOnly} />;
        }
        return <p key={quest.id}>Item Type Unknown</p>;
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
