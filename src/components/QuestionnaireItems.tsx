import { AnswerDto, LikertAnswerDto, LikertQuestionDto, RichTextDisplayDto, TextAnswerDto, TextQuestionDto } from "@api/TenantAPIClient";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRadioGroup, IonRadio, IonInput, IonItem, IonTextarea } from "@ionic/react";
import i18next from 'i18next';
import "./Questionniare.css"
import { useEffect } from "react";


/*----------------------------------- Interfaces -----------------------------------------------------------*/

interface LikertQuestionProps {
    questionItem: LikertQuestionDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null, required: boolean) => void;
    answer: LikertAnswerDto | null;
}

interface TextFieldProps {
    questionItem: RichTextDisplayDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
}

interface TextQuestionProps {
    questionItem: TextQuestionDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null, required: boolean) => void;
    answer: TextAnswerDto | null;
}


/*-------------------------------------- Komponenten ------------------------------------------------------*/

export const LikertQuestion: React.FC<LikertQuestionProps> = ({ questionItem, onAnswerChange, answer }) => {
    var languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";
    var question = questionItem.text.translations[languageId];
    let choices = questionItem.scale.map(answer => <div key={answer.id}><IonRadio labelPlacement="end" value={answer.id}>{answer.label.translations[languageId]}</IonRadio></div>);

    function createAnswerDto(questionId: string, answervalue: string) {
        const answerdto = new LikertAnswerDto();
        answerdto.answered = new Date();
        answerdto.questionId = questionId;
        answerdto.value = answervalue;
        onAnswerChange(questionItem.id, answerdto, questionItem.validation.required);
    }


    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardHeader className="questionCard-header">{questionItem.validation.required ? question + " *" : question}
            </IonCardHeader>
            <IonCardContent className="questionCard-content">

                <IonRadioGroup value={answer?.value || ''} onIonChange={(e: any) => createAnswerDto(questionItem.id, e.detail.value)}>
                    <div className="choices" >
                        {choices}
                    </div>
                </IonRadioGroup>
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


export const TextQuestion: React.FC<TextQuestionProps> = ({ questionItem, onAnswerChange, answer }) => {
    var languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";
    var question = questionItem.text.translations[languageId];

    function createAnswerDto(questionId: string, answervalue: string) {
        const answerdto = new TextAnswerDto();
        answerdto.answered = new Date();
        answerdto.questionId = questionId;
        answerdto.value = answervalue;
        onAnswerChange(questionItem.id, answerdto, questionItem.validation.required);
    }

    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardHeader className="questionCard-header">{questionItem.validation.required ? question + " *" : question}</IonCardHeader>
            <IonCardContent className="questionCard-content">
                <IonTextarea clearOnEdit={false} autoGrow={true} className="questionTextArea" onIonChange={(e: any) => createAnswerDto(questionItem.id, e.detail.value)} value={answer?.value || ''}/>
            </IonCardContent>
        </IonCard>
    );
}