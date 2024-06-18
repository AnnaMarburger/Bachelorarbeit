
/*----------------------------------- Imports -----------------------------------------------------------*/


import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonRadio, IonRadioGroup, IonText, IonSegment, IonSegmentButton, IonLabel, IonButton, IonProgressBar, IonIcon, IonChip, IonCol, IonGrid, IonRow, IonFab, IonBackButton, IonFabButton, IonNavLink } from "@ionic/react";
import { QuestionnaireInstanceDetailsDto, ContentPageDto, ContentDto } from "../api/backend-tenant/models";
import { useState } from "react";
import { arrowBack, arrowForward, calendar, close } from 'ionicons/icons';



/*----------------------------------- Interfaces -----------------------------------------------------------*/

interface QuestionnaireProps {
    questionnaireInstanz: QuestionnaireInstanceDetailsDto;
}

interface QuestionSCProps {
    questionItem: ContentDto;
}

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
const Questionnaire: React.FC<QuestionnaireProps> = ({ questionnaireInstanz }) => {
    return (
        <div className="questionnaire">
            <IonFab slot="fixed" vertical="top" horizontal="end">
                <IonNavLink routerDirection="back" component={() =>{}}>
                    <IonFabButton size="small" >
                        <IonIcon icon={close}></IonIcon>
                    </IonFabButton>
                </IonNavLink>
            </IonFab>
            <IonText><h1>{questionnaireInstanz.questionnaireName}</h1></IonText>
            
            <IonGrid>
                <IonRow>
                    <IonCol size="auto">
                        <IonChip disabled={true}>
                            <IonIcon icon={calendar} color="primary"></IonIcon>
                            <IonLabel>{questionnaireInstanz.started?.toDateString()}</IonLabel>
                        </IonChip>
                    </IonCol>
                    <IonCol size="auto">
                        <IonChip disabled={true}>{questionnaireInstanz.state}</IonChip>
                    </IonCol>
                    <IonCol size="auto">
                        <IonChip disabled={true}>{questionnaireInstanz.amountQuestions} Fragen</IonChip>
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
        <div id="Page">
            <IonButton size="small" shape="round" disabled={(pageID < 1) ? true : false} onClick={() => {
                let newpage = pageID - 1
                if (newpage >= 0) {
                    setPageID(newpage);
                }
            }}> <IonIcon icon={arrowBack} />
            </IonButton>
            <IonButton size="small" shape="round" disabled={(pageID >= pages.length - 1) ? true : false} onClick={() => {
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
    let data = allQuestions.map(quest =>
        <QuestionSC questionItem={quest} key={quest.id} />
    )

    return (
        <div>{data}</div>
    );
}


//creates a single choice question card
const QuestionSC: React.FC<QuestionSCProps> = ({ questionItem }) => {
    let description = "description";
    let choices = 3;
    let question = questionItem.name;

    return (
        <IonCard className="questionCard">
            <IonCardHeader>
                <IonCardTitle>{question}</IonCardTitle>
                <IonCardSubtitle>{description}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                <IonRadioGroup>
                    <IonRadio labelPlacement="end">Answer 1</IonRadio>
                    <br />
                    <IonRadio labelPlacement="end">Answer 2</IonRadio>
                    <br />
                    <IonRadio labelPlacement="end">Answer 3</IonRadio>
                    <br />
                    <IonRadio labelPlacement="end">Answer 4</IonRadio>
                </IonRadioGroup>
            </IonCardContent>
        </IonCard>

    );
}