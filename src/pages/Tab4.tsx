
import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonTitle, IonToolbar, useIonActionSheet, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { useState } from 'react';
import "./Tab4.css";
import "./main.css"
import { UpdateCurrentUserCommand, UpdateCurrentUserPasswordCommand } from '@api/GatewayAPIClient';
import { closeSharp, earthOutline, handLeftOutline, newspaperOutline, notificationsOutline, person, shieldCheckmarkOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { clearAccount, readActiveAccount, updateAccount } from '../modules/dalAccount';
import { Account } from '../modules/account';
import { useGatewayApi } from '@api/useGatewayApi';
import { Preferences } from '@capacitor/preferences';


const Tab4: React.FC = () => {
  const { t, i18n } = useTranslation();
  const router = useIonRouter();

  //Nutzerdaten abrufen
  const [account, setAccount] = useState<Account | null>(readActiveAccount());

  //state vars for modal and action sheet
  const [present] = useIonActionSheet();
  const [formValues, setFormValues] = useState({ name: account?.name ?? '', familyName: account?.familyName ?? '', password: '', newpassword: '' });
  const [showModal, setShowModal] = useState(false);

  useIonViewWillEnter(() => {
    useGatewayApi().currentUserApi.getCurrentUser().then(user => {
      if(account){
        const na = account;
        na.familyName = user.familyName;
        na.name = user.givenName;
        setAccount(na);
        updateAccount(na);
      }
    })
  }, []);

  async function handleLogout(e: any) {
    e.preventDefault();
    try {
      // remove any user specific data from device
      await clearAccount(); 
      await Preferences.remove({ key: 'acceptedDisclaimer' });
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  function handleInputChange(field: keyof typeof formValues, value: string) {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  async function saveNameChange() {
    if (account) {
      const uc = new UpdateCurrentUserCommand();
      uc.familyName = formValues.familyName;
      uc.givenName = formValues.name;
      try {
        const response = await useGatewayApi().currentUserApi.updateCurrentUser(uc);
        console.log("Sent UpdateNameCommand", response);
        const na = account;
        na.familyName = formValues.familyName;
        na.name = formValues.name;
        setAccount(na);
        updateAccount(account);
        alert("Changed Name successfully!");
      } catch (error) {
        alert("There was an error while trying to update your name. Try again.");
      }
    }
  }

  async function savePasswordChange() {
    if (account?.password !== formValues.password) {
      alert("Password is not correct!");
    } else if(formValues.newpassword.length < 8){
      alert("Password has to contain at least 8 characters!");
    }else {
      const uc = new UpdateCurrentUserPasswordCommand();
      uc.oldPassword = formValues.password;
      uc.newPassword = formValues.newpassword;
      try {
        const response = await useGatewayApi().currentUserApi.updateCurrentUserPassword(uc);
        console.log("Sent UpdateNameCommand", response);
        const na = account;
        na.password = formValues.newpassword;
        setAccount(na);
        updateAccount(account);
        alert("Changed Password successfully!");
      } catch (error) {
        alert(error);
      }
    }
    handleInputChange("newpassword", "");
    handleInputChange("password", "");
  };

  const handleLanguageChange = (result: any) => {
    if (result) {
      const lng = result.data.action
      localStorage.removeItem('i18nextLng');
      i18n.changeLanguage(lng);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen={true} className='ion-no-padding'>
        <IonCard className='user-card'>
          <IonCardContent>
            <IonList inset={true} className="user-list">
              <IonItem lines="none" detail={false} button={true} onClick={() => setShowModal(true)}>
                <IonIcon aria-hidden="true" color="light" icon={person} size="large" slot="start"></IonIcon>
                <IonLabel color="light">
                  <p id='user-name'> {(account?.name || account?.familyName) ? ((account.name ?? " ") + " " + (account.familyName ?? " ")) : ("Anonymous")}</p>
                  <p id='account-name'>{account?.userName}</p>
                </IonLabel>
              </IonItem>
              <IonButton color="light" onClick={async (e: any) => {
                await handleLogout(e);
                router.push('/landing');
              }} expand='block'>Log Out</IonButton>
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
                        action: 'de',
                      },
                    },
                    {
                      text: 'Español',
                      data: {
                        action: 'es',
                      },
                    },
                  ],
                })
              }>
                <IonIcon aria-hidden="true" color="light" icon={earthOutline} slot="start"></IonIcon>
                <IonLabel color="light">{t("UserScreen.Lang")}</IonLabel>
              </IonItem>
              <IonItem lines="none" button={true} onClick={() => router.push('/home/tab4/notifs')}>
                <IonIcon aria-hidden="true" color="light" icon={notificationsOutline} slot="start"></IonIcon>
                <IonLabel color="light">{t("UserScreen.Notif")}</IonLabel>
              </IonItem>
            </IonList>
            <IonList inset={true} className='links-list'>
              <IonItem lines="none" button={true} onClick={() => router.push('/disclaimer')}>
                <IonIcon aria-hidden="true" color="light" icon={handLeftOutline} slot="start"></IonIcon>
                <IonLabel color="light">{t("UserScreen.Disclaimer")}</IonLabel>
              </IonItem>
              <IonItem lines="none" button={true} onClick={() => console.log("todo")}>
                <IonIcon aria-hidden="true" color="light" icon={shieldCheckmarkOutline} slot="start"></IonIcon>
                <IonLabel color="light">{t("UserScreen.PrivacyPolicy")}</IonLabel>
              </IonItem>
              <IonItem lines="none" button={true} onClick={() => console.log("todo")}>
                <IonIcon aria-hidden="true" color="light" icon={newspaperOutline} slot="start"></IonIcon>
                <IonLabel color="light">{t("UserScreen.LegalNotice")}</IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle id="title-dark">{t("UserScreen.EditUserDtoModal.Header")}</IonTitle>
              <IonButtons slot="secondary">
                <IonButton slot="end" onClick={() => setShowModal(false)}>
                  <IonIcon slot="icon-only" icon={closeSharp}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className='ion-no-padding'>
            <IonList inset={true} className='modal-list'>
              <IonItem detail={false} lines="none">
                <IonLabel color="light" className="Input-label">{t("UserScreen.EditUserDtoModal.ChangeName")}</IonLabel>
              </IonItem>
              <IonItem detail={false} lines="none">
                <IonInput
                  value={formValues.name}
                  type="text"
                  color="light"
                  className='custom'
                  fill="outline"
                  label={t("UserScreen.EditUserDtoModal.Surname")}
                  labelPlacement="floating"
                  onIonInput={(e: any) => handleInputChange("name", e.detail.value!)}>
                </IonInput>
              </IonItem>
              <IonItem detail={false} lines="none">
                <IonInput
                  value={formValues.familyName}
                  type="text"
                  color="light"
                  className='custom'
                  fill="outline"
                  label={t("UserScreen.EditUserDtoModal.Familyname")}
                  labelPlacement="floating"
                  onIonInput={(e: any) => handleInputChange("familyName", e.detail.value!)}>
                </IonInput>
              </IonItem>
              <IonButton expand="block" id="save-button" color="light" onClick={saveNameChange}>Save</IonButton>
            </IonList>
            <IonList inset={true} className='modal-list'>
              <IonItem detail={false} lines="none">
                <IonLabel color="light" className="Input-label">{t("UserScreen.EditUserDtoModal.ChangePassword")}</IonLabel>
              </IonItem>
              <IonItem detail={false} lines="none">
                <IonInput
                  value={formValues.password}
                  type="password"
                  color="light"
                  className='custom'
                  fill="outline"
                  label={t("UserScreen.EditUserDtoModal.OldPassword")}
                  labelPlacement="floating"
                  onIonInput={(e: any) => handleInputChange("password", e.detail.value! || "")}>
                </IonInput>
              </IonItem>
              <IonItem detail={false} lines="none">
                <IonInput
                  value={formValues.newpassword}
                  type="password"
                  color="light"
                  className='custom'
                  fill="outline"
                  label={t("UserScreen.EditUserDtoModal.NewPassword")}
                  labelPlacement="floating"
                  onIonInput={(e: any) => handleInputChange("newpassword", e.detail.value!)}>
                </IonInput>
              </IonItem>
              <IonButton expand='block' id="save-button" color="light" onClick={savePasswordChange}>Save</IonButton>
            </IonList>
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