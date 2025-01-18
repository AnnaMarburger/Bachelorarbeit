import { ImageDisplayDto, RichTextDisplayDto, TextDisplayDto } from "@api/TenantAPIClient";
import { IonCard, IonCardContent, IonImg } from "@ionic/react";
import i18next from 'i18next';

import "../pages/sub/InfoPage.css";
/*----------------------------------- Interfaces -----------------------------------------------------------*/

interface TextFieldProps {
    contentItem: RichTextDisplayDto;
}

interface HeaderItemProps {
    contentItem: TextDisplayDto;
}

interface ImageItemProps {
    contentItem: ImageDisplayDto;
}

/*-------------------------------------- Komponenten ------------------------------------------------------*/


export const TextItem: React.FC<TextFieldProps> = ({ contentItem }) => {
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de" && contentItem.value.translations["56051e9d-fd94-4fa5-b26e-b5c462326ecd"])
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

    var cont = contentItem.value.translations[languageId].content;
    var text = "";
    if (cont !== undefined)
        text = cont[0] ? (cont[0].content ? (cont[0].content[0].text ?? "fehlender text") : "fehlender text") : "fehlender text";
    
    return (
        <IonCard key={contentItem.id} className="questionCard">
            <IonCardContent className="infoItem-text">{text}</IonCardContent>
        </IonCard>
    );
}

export const HeaderItem: React.FC<HeaderItemProps> = ({ contentItem }) => {
    let languageId = "00000000-0000-0000-0000-000000000001";
    if (i18next.language == "de" && contentItem.value.translations["56051e9d-fd94-4fa5-b26e-b5c462326ecd"])
        languageId = "56051e9d-fd94-4fa5-b26e-b5c462326ecd";

    var text = contentItem.value.translations[languageId];
    if (text == undefined)
        text = "fehlender text";
    return (
        <IonCard key={contentItem.id} className="questionCard">
            <IonCardContent className="infoItem-header">{text}</IonCardContent>
        </IonCard>
    );
}

export const ImageItem: React.FC<ImageItemProps> = ({ contentItem }) => {
    return (
        <IonCard key={contentItem.id} className="questionCard">
            <IonCardContent className="infoItem-img">
                <IonImg
                    src={contentItem.asset?.file?.url}
                    alt="The Wisconsin State Capitol building in Madison, WI at night"
                ></IonImg>
            </IonCardContent>
        </IonCard>
    );
}