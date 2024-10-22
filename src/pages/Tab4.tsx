
import { IonButton, IonCard, IonCardContent, IonContent, IonDatetime, IonFab, IonFabButton, IonIcon, IonInput, IonInputPasswordToggle, IonItem, IonItemGroup, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonThumbnail, IonTitle, IonToolbar, useIonActionSheet, useIonRouter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { Suspense, useEffect, useState } from 'react';
import "./Tab4.css";
import "./main.css"
import { LogoutComponent } from '../components/LogoutComponent'
import { useGatewayApi } from '@api/useGatewayApi';
import { CurrentUserClient } from '@api/GatewayAPIClient';
import { closeSharp, earthOutline, handLeftOutline, newspaperOutline, notificationsOutline, person, shieldCheckmarkOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { readActiveAccount } from '../modules/dalAccount';
import { Account } from '../modules/account';


const Tab4: React.FC = () => {
  let currentUserApi: CurrentUserClient;
  const { t, i18n } = useTranslation();
  const router = useIonRouter();

  //Nutzerdaten abrufen
  const [account, setAccount] = useState<Account | null>(readActiveAccount());

  //state vars for modal and action sheet
  const [present] = useIonActionSheet();
  const [formValues, setFormValues] = useState({ name: account?.name?? '', familyName: account?.familyName?? '', password: '', newpassword: ''});
  const [showModal, setShowModal] = useState(false);


  function handleRefresh(e: any) {
    e.preventDefault();
  }

  function handleInputChange(field: keyof typeof formValues, value: string) {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  function handleModalSave() {
    //saveToServer(updatedUserDto).then(() => { setShowModal(false) });
  };


  const handleLanguageChange = (result: any) => {
    const lng = result.data.action
    localStorage.removeItem('i18nextLng');
    i18n.changeLanguage(lng);

  };

  return (
      <IonPage>
        <IonContent>
          <IonCard className='user-card'>
            <IonCardContent>
              <IonList inset={true} className="user-list">
                <IonItem lines="none" button={true} onClick={() => setShowModal(true)}>
                  <IonIcon aria-hidden="true" color="light" icon={person} size="large" slot="start"></IonIcon>
                  <IonLabel color="light">
                    <p id='user-name'> {(account?.name || account?.familyName) ? ((account.name ?? " ") + (account.familyName ?? " ")) : ("Anonymous")}</p>
                    <h4>{account?.userName}</h4>
                  </IonLabel>
                </IonItem>
                <LogoutComponent />
              </IonList>
              <IonList inset={true} className='settings-list'>
                <IonItem lines="none" button={true} onClick={() =>
                  present({
                    header: `${t("UserScreen.ASHeader")}`,
                    onDidDismiss(event) {
                      handleLanguageChange(event.detail);
                    },
                    buttons: [
                      {
                        text: 'English',
                        data: {
                          action: 'en',
                        },
                      },
                      {
                        text: 'Deutsch',
                        data: {
                          action: 'de-DE',
                        },
                      },
                      {
                        text: 'Español',
                        data: {
                          action: 'es-ES',
                        },
                      },
                    ],
                  })
                }>
                  <IonIcon aria-hidden="true" color="light" icon={earthOutline} slot="start"></IonIcon>
                  <IonLabel color="light">
                    <strong> {t("UserScreen.Lang")}</strong>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none" button={true} onClick={() => router.push('/home/tab4/notifs')}>
                  <IonIcon aria-hidden="true" color="light" icon={notificationsOutline} slot="start"></IonIcon>
                  <IonLabel color="light">
                    <strong> {t("UserScreen.Notif")}</strong>
                  </IonLabel>
                </IonItem>
              </IonList>
              <IonList inset={true} className='links-list'>
                <IonItem lines="none" button={true} onClick={() => console.log("todo")}>
                  <IonIcon aria-hidden="true" color="light" icon={handLeftOutline} slot="start"></IonIcon>
                  <IonLabel color="light">
                    <strong> {t("UserScreen.Disclaimer")}</strong>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none" button={true} onClick={() => console.log("todo")}>
                  <IonIcon aria-hidden="true" color="light" icon={shieldCheckmarkOutline} slot="start"></IonIcon>
                  <IonLabel color="light">
                    <strong> {t("UserScreen.PrivacyPolicy")}</strong>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none" button={true} onClick={() => console.log("todo")}>
                  <IonIcon aria-hidden="true" color="light" icon={newspaperOutline} slot="start"></IonIcon>
                  <IonLabel color="light">
                    <strong> {t("UserScreen.LegalNotice")}</strong>
                  </IonLabel>
                </IonItem>
              </IonList>

            </IonCardContent>
          </IonCard>

          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonContent className="modal">
              <IonFab slot="fixed" vertical="top" horizontal="end">
                <IonFabButton onClick={() => setShowModal(false)}>
                  <IonIcon icon={closeSharp}></IonIcon>
                </IonFabButton>
              </IonFab>
              <div className='modal'>
                <IonTitle id="modal-title" className='center' color="light" >{t("UserScreen.EditUserDtoModal.Header")}</IonTitle>
                <IonLabel color="light">
                  <h4>{t("UserScreen.EditUserDtoModal.ChangeName")}</h4>
                </IonLabel>
                <br />
                <IonInput value={formValues.name} type="text" color="light" className='custom' fill="outline" label={t("UserScreen.EditUserDtoModal.Surname")} labelPlacement="floating" onIonInput={(e: any) => handleInputChange("name", e.detail.value!)}>{account?.name}</IonInput>
                <br />
                <IonInput value={formValues.familyName} type="text" color="light" className='custom' fill="outline" label={t("UserScreen.EditUserDtoModal.Familyname")} labelPlacement="floating" onIonInput={(e: any) => handleInputChange("name", e.detail.value!)}>{account?.familyName}</IonInput>
                <br />
                <IonLabel color="light">
                  <h4>{t("UserScreen.EditUserDtoModal.ChangePassword")}</h4>
                </IonLabel>
                <br />
                <IonInput value={formValues.password} type="password" color="light" className='custom' fill="outline" label={t("UserScreen.EditUserDtoModal.OldPassword")} labelPlacement="floating" onIonInput={(e: any) => handleInputChange("password", e.detail.value!)}></IonInput>
                <br />
                <IonInput value={formValues.newpassword} type="password" color="light" className='custom' fill="outline" label={t("UserScreen.EditUserDtoModal.NewPassword")} labelPlacement="floating" onIonInput={(e: any) => handleInputChange("newpassword", e.detail.value!)}></IonInput>
                <br />
                <IonButton id="savebutton" expand="block" color="light" onClick={handleModalSave}>Save</IonButton>
              </div>
            </IonContent>
          </IonModal>
          <IonModal keepContentsMounted={true}>
            <IonDatetime id="date" presentation="date" ></IonDatetime>
          </IonModal>
        </IonContent>
      </IonPage>
  );
};

export default Tab4;

const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
);