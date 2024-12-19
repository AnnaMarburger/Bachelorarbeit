import { IonPage, IonContent } from "@ionic/react";

const NotFound: React.FC = () => {
    return (
        <IonPage>
            <IonContent>
                <div className="disclaimer" >
                    <h1>Not Found</h1>
                    <p>The page you're looking for does not exist.</p>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default NotFound;
