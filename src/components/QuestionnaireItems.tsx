import { LikertQuestionDto, RichTextDisplayDto, TextQuestionDto } from "@api/TenantAPIClient";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRadioGroup, IonRadio, IonInput, IonItem, IonTextarea } from "@ionic/react";
import i18next from 'i18next';
import "./Questionniare.css"


/*----------------------------------- Interfaces -----------------------------------------------------------*/

interface LikertQuestionProps {
    questionItem: LikertQuestionDto;
}

interface TextFieldProps {
    questionItem: RichTextDisplayDto;
}

interface TextQuestionProps {
    questionItem: TextQuestionDto;
}


/*-------------------------------------- Komponenten ------------------------------------------------------*/

export const LikertQuestion: React.FC<LikertQuestionProps> = ({ questionItem }) => {
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";
    let question = questionItem.text.translations[languageId];
    let answers = questionItem.scale.map(answer => <div key={answer.id}><IonRadio labelPlacement="end">{answer.label.translations[languageId]}</IonRadio></div>);

    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardHeader className="questionCard-header">{question}
            </IonCardHeader>
            <IonCardContent className="questionCard-content">
                <div className="choices">
                    {answers}
                </div>
            </IonCardContent>
        </IonCard>

    );
}


export const TextItem: React.FC<TextFieldProps> = ({ questionItem }) => {
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

    var cont = questionItem.value.translations[languageId].content;
    var text = "";
    if (cont !== undefined)
        text = cont[0] ? (cont[0].content ? (cont[0].content[0].text ?? "fehlender text") : "fehlender text") : "fehlender text";
    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardContent className="textItem">{text}</IonCardContent>
        </IonCard>
    );
}


export const TextQuestion: React.FC<TextQuestionProps> = ({ questionItem }) => {
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";
    let question = questionItem.text.translations[languageId];

    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardHeader className="questionCard-header">{question}</IonCardHeader>
            <IonCardContent className="questionCard-content">
                <IonTextarea clearOnEdit={false} autoGrow={true} className="questionTextArea"></IonTextarea>
            </IonCardContent>
        </IonCard>
    );
}