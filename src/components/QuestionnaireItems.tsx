import { AnswerDto, ChoiceAnswerDto, ChoiceQuestionDto, LikertAnswerDto, LikertQuestionDto, NumberAnswerDto, NumberQuestionDto, RichTextDisplayDto, SliderAnswerDto, SliderQuestionDto, TextAnswerDto, TextDisplayDto, TextQuestionDto } from "@api/TenantAPIClient";
import { IonCard, IonCardHeader, IonCardContent, IonRadioGroup, IonRadio, IonInput, IonItem, IonTextarea, IonRange } from "@ionic/react";
import i18next from 'i18next';
import "../pages/sub/Questionniare.css"
import { useEffect } from "react";


/*----------------------------------- Interfaces -----------------------------------------------------------*/

interface LikertQuestionProps {
    questionItem: LikertQuestionDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
    answer: LikertAnswerDto | null;
    viewOnly: boolean;
}

interface ChoiceQuestionProps {
    questionItem: ChoiceQuestionDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
    answer: ChoiceAnswerDto | null;
    viewOnly: boolean;
}

interface TextFieldProps {
    questionItem: RichTextDisplayDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
}

interface HeaderItemProps {
    questionItem: TextDisplayDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
}

interface TextQuestionProps {
    questionItem: TextQuestionDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
    answer: TextAnswerDto | null;
    viewOnly: boolean;
}

interface NumberQuestionProps {
    questionItem: NumberQuestionDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
    answer: NumberAnswerDto | null;
    viewOnly: boolean;
}

interface SliderQuestionProps {
    questionItem: SliderQuestionDto;
    onAnswerChange: (questionId: string, answer: AnswerDto | null) => void;
    answer: SliderAnswerDto | null;
    viewOnly: boolean;
}


/*-------------------------------------- Komponenten ------------------------------------------------------*/

export const LikertQuestion: React.FC<LikertQuestionProps> = ({ questionItem, onAnswerChange, answer, viewOnly }) => {
    var languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";
    var question = questionItem.text.translations[languageId];
    let choices = questionItem.scale.map(answer => <div key={answer.id}><IonRadio disabled={viewOnly} labelPlacement="end" value={answer.id}>{answer.label.translations[languageId]}</IonRadio></div>);

    useEffect(() => {
        if (questionItem.answer && answer === null)
            onAnswerChange(questionItem.id, questionItem.answer);
    }, []);

    function createAnswerDto(questionId: string, answervalue: string) {
        if (viewOnly)
            return;

        const answerdto = new LikertAnswerDto();
        answerdto.answered = new Date();
        answerdto.questionId = questionId;
        answerdto.value = answervalue;
        onAnswerChange(questionItem.id, answerdto);
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

export const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({ questionItem, onAnswerChange, answer, viewOnly }) => {
    var languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";
    var question = questionItem.text.translations[languageId];
    let choices = questionItem.choices.map(item => <div key={item.id}><IonRadio disabled={viewOnly} labelPlacement="end" value={item.id}>{item.label.translations[languageId]}</IonRadio></div>);

    useEffect(() => {
        if (questionItem.answer && answer === null)
            onAnswerChange(questionItem.id, questionItem.answer);
    }, []);

    function createAnswerDto(questionId: string, answervalue: string) {
        if (viewOnly)
            return;

        const answerdto = new ChoiceAnswerDto();
        answerdto.answered = new Date();
        answerdto.questionId = questionId;
        answerdto.values = [answervalue];
        onAnswerChange(questionItem.id, answerdto);
    }

    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardHeader className="questionCard-header">{questionItem.validation.required ? question + " *" : question}
            </IonCardHeader>
            <IonCardContent className="questionCard-content">

                <IonRadioGroup value={answer?.values? answer.values[0] : ''} onIonChange={(e: any) => createAnswerDto(questionItem.id, e.detail.value)}>
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
    if (i18next.language == "de" && questionItem.value.translations["56051e9d-fd94-4fa5-b26e-b5c462326ecd"])
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

export const HeaderItem: React.FC<HeaderItemProps> = ({ questionItem }) => {
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de" && questionItem.value.translations["56051e9d-fd94-4fa5-b26e-b5c462326ecd"])
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

    var text = questionItem.value.translations[languageId];
    if (text == undefined)
        text = "fehlender text";
    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardContent className="headerItem">{text}</IonCardContent>
        </IonCard>
    );
}

export const TextQuestion: React.FC<TextQuestionProps> = ({ questionItem, onAnswerChange, answer, viewOnly }) => {
    var languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";
    var question = questionItem.text.translations[languageId];

    useEffect(() => {
        if (questionItem.answer && answer !== null)
            onAnswerChange(questionItem.id, questionItem.answer);
    }, []);

    function createAnswerDto(questionId: string, answervalue: string) {
        if (viewOnly)
            return;

        const answerdto = new TextAnswerDto();
        answerdto.answered = new Date();
        answerdto.questionId = questionId;
        answerdto.value = answervalue;
        onAnswerChange(questionItem.id, answerdto);
    }

    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardHeader className="questionCard-header">{questionItem.validation.required ? question + " *" : question}</IonCardHeader>
            <IonCardContent className="questionCard-content">
                <IonTextarea value={answer?.value} disabled={viewOnly} clearOnEdit={false} autoGrow={true} className="questionTextArea" onIonChange={(e: any) => createAnswerDto(questionItem.id, e.detail.value)} />
            </IonCardContent>
        </IonCard>
    );
}


export const NumberQuestion: React.FC<NumberQuestionProps> = ({ questionItem, onAnswerChange, answer, viewOnly }) => {
    var languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";
    var question = questionItem.text.translations[languageId];

    useEffect(() => {
        if (questionItem.answer && answer !== null){
            onAnswerChange(questionItem.id, questionItem.answer);
            console.log(answer);
        }
    }, []);

    function createAnswerDto(questionId: string, answervalue: number) {
        if (viewOnly)
            return;

        const answerdto = new NumberAnswerDto();
        answerdto.answered = new Date();
        answerdto.questionId = questionId;
        answerdto.value = answervalue;
        onAnswerChange(questionItem.id, answerdto);
    }

    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardHeader className="questionCard-header">{questionItem.validation.required ? question + " *" : question}</IonCardHeader>
            <IonCardContent className="questionCard-content">
                <IonInput value={answer?.value} disabled={viewOnly} clearOnEdit={false} type="number" className="questionNumberInput" placeholder="00" onIonChange={(e: any) => createAnswerDto(questionItem.id, e.detail.value)}></IonInput>
            </IonCardContent>
        </IonCard>
    );
}


export const SliderQuestion: React.FC<SliderQuestionProps> = ({ questionItem, onAnswerChange, answer, viewOnly }) => {
    var languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de")
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";
    var question = questionItem.text.translations[languageId];

    useEffect(() => {
        if (questionItem.answer && answer !== null){
            onAnswerChange(questionItem.id, questionItem.answer);
            console.log(answer);
        }
    }, []);

    function createAnswerDto(questionId: string, answervalue: number) {
        if (viewOnly)
            return;

        const answerdto = new SliderAnswerDto();
        answerdto.answered = new Date();
        answerdto.questionId = questionId;
        answerdto.value = answervalue;
        onAnswerChange(questionItem.id, answerdto);
    }

    return (
        <IonCard key={questionItem.id} className="questionCard">
            <IonCardHeader className="questionCard-header">{questionItem.validation.required ? question + " *" : question}</IonCardHeader>
            <IonCardContent className="questionCard-content">
                <IonRange  value={answer?.value} disabled={viewOnly} className="sliderItem" pin={true} pinFormatter={(value: number) => `${value}`} snaps={true} min={0} max={7} onIonChange={(e: any) => createAnswerDto(questionItem.id, e.detail.value)}></IonRange>
            </IonCardContent>
        </IonCard>
    );
}