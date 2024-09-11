
import { IonActionSheet, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonInputPasswordToggle, IonItem, IonItemGroup, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonThumbnail, IonTitle, IonToolbar, useIonActionSheet, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { Auth } from '../services/AuthService';
import { Subscription } from 'rxjs';
import { Suspense, useState } from 'react';
import "./Tab4.css";
import "./main.css"

import { useGatewayApi } from '@api/useGatewayApi';
import { Account, AccountLayer } from '../modules/dalAccount';
import { CurrentUserClient, UpdateCurrentUserCommand, UserDetailsDto } from '@api/GatewayAPIClient';
import {  closeSharp, earthOutline, handLeftOutline, newspaperOutline, notificationsOutline, person, shieldCheckmarkOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';


const Tab4: React.FC = () => {
  let currentUserApi: CurrentUserClient;
  let subs: Subscription[] = [];
  let dalAccount: AccountLayer;
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState(Auth.Instance.loadUserInfo());
  const [userDto, setUserDto] = useState<UserDetailsDto>(new UserDetailsDto());

  //state vars for modal and action sheet
  const [present] = useIonActionSheet();
  const [formValues, setFormValues] = useState({
    givenName: '', familyName: '', phoneNumber: '', streetAddress: '', birthDay: '', country: '', postalCode: '', sex: ''
  });
  const [showModal, setShowModal] = useState(false);

  useIonViewWillEnter(() => {
    safeToken()

    subs.push(
      Auth.Instance.user$.subscribe((user) => {
        setUser(user)
      })
    )
  });

  useIonViewDidLeave(() => {
    subs.forEach(sub => sub.unsubscribe());
  });


  function handleSignOut(e: any) {
    e.preventDefault();
    Auth.Instance.signOut();
  }

  function handleRefresh(e: any) {
    e.preventDefault();
    Auth.Instance.refreshToken();
  }

  async function safeToken() {
    setUser(Auth.Instance.loadUserInfo());
    const token = await Auth.Instance.getValidToken();
    dalAccount = new AccountLayer(new Account(JSON.parse(JSON.stringify(user))["sub"], token.accessToken, undefined, undefined));
    currentUserApi = useGatewayApi().currentUserApi;
    const cu = await currentUserApi.getCurrentUser();
    setUserDto(cu);
    setFormValues((prevValues) => ({
      ...prevValues,
      ["givenName"]: userDto.givenName || "",
      ["familyName"]: userDto.familyName || "",
      ["streetAdress"]: userDto.streetAddress || "",
      ["phoneNumber"]: userDto.phoneNumber || "",
      ["birthDay"]: userDto.birthDay?.toDateString() || "",
      ["country"]: userDto.country || "",
      ["postalCode"]: userDto.postalCode || "",
      ["sex"]: userDto.sex || "",
    }));
  }

  function handleInputChange(field: keyof typeof formValues, value: string) {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };

  function handleModalSave() {
    const updatedUserDto = new UserDetailsDto({
      ...userDto,  // Spread the existing userDto details
      givenName: formValues.givenName,
      familyName: formValues.familyName,
      phoneNumber: formValues.phoneNumber,
      streetAddress: formValues.streetAddress,
      birthDay: formValues.birthDay ? new Date(formValues.birthDay) : undefined,
      country: formValues.country,
      postalCode: formValues.postalCode
    });

    setUserDto(updatedUserDto);
    saveToServer(updatedUserDto).then(() => { setShowModal(false) });
  };

  async function saveToServer(updatedUser: UserDetailsDto) {
    const updateCommand = new UpdateCurrentUserCommand(updatedUser);
    currentUserApi = useGatewayApi().currentUserApi;
    const response = await currentUserApi.updateCurrentUser(updateCommand);
    console.log("updated: " + response.givenName + " " + response.familyName);
  }

  const handleLanguageChange = (result: any) => {
    const lng = result.data.action
    console.log(lng);
    localStorage.removeItem('i18nextLng');
    i18n.changeLanguage(lng);

  };

  return (
    <Suspense fallback={<Loader />}>
    <IonPage>
      <IonContent>
        <IonCard className='user-card'>
          <IonCardContent>
            <IonList inset={true} className="user-list">
              <IonItem lines="none" button={true} onClick={() => setShowModal(true)}>
                <IonIcon aria-hidden="true" color="light" icon={person} size="large" slot="start"></IonIcon>
                <IonLabel color="light">
                  <p id='user-name'> {(userDto.givenName || userDto.familyName) ? (userDto.givenName + " " + userDto.familyName) : ("Anonymous")}</p>
                  <h4>{userDto.email}</h4>
                </IonLabel>
              </IonItem>
              <IonButton className="button" color="light" onClick={handleSignOut} expand='block'>Log Out</IonButton>
            </IonList>
            <IonList inset={true}  className='settings-list'>
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
              <IonItem lines="none" button={true} onClick={() => console.log("todo")}>
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
              <IonGrid className='ion-no-padding'>
                <IonRow>
                  <IonCol className='input-row-margin'>
                    <IonInput clearOnEdit={false} value={formValues.givenName} color="light" className='custom' fill="outline" label={t("UserScreen.EditUserDtoModal.GivenName")} labelPlacement="floating" onIonInput={(e: any) => { handleInputChange("givenName", e.detail.value!) }}></IonInput>
                  </IonCol>
                  <IonCol >
                    <IonInput value={formValues.familyName} color="light" className='custom' fill="outline" label={t("UserScreen.EditUserDtoModal.FamilyName")} labelPlacement="floating" onIonInput={(e: any) => handleInputChange("familyName", e.detail.value!)}></IonInput>
                  </IonCol>
                </IonRow>
                <br />
                <IonRow>
                  <IonCol className='input-row-margin' >
                    <IonSelect value={formValues.sex} color="light" label={t("UserScreen.EditUserDtoModal.Sex.Header")} justify="start" labelPlacement="floating" interface="popover" fill='outline' onIonChange={(e: any) => handleInputChange("sex", e.detail.value!)} >
                      <IonSelectOption>{t("UserScreen.EditUserDtoModal.Sex.Option1")}</IonSelectOption>
                      <IonSelectOption>{t("UserScreen.EditUserDtoModal.Sex.Option2")}</IonSelectOption>
                      <IonSelectOption>{t("UserScreen.EditUserDtoModal.Sex.Option3")}</IonSelectOption>
                    </IonSelect>
                  </IonCol>
                  <IonCol className='center'>
                    <IonRow>
                      <IonText className='center' color='light'>{t("UserScreen.EditUserDtoModal.Birthday") + ": "} </IonText>
                    </IonRow>
                    <IonRow>
                      <IonDatetimeButton id="datetimebutton" datetime="date"></IonDatetimeButton>
                    </IonRow>
                  </IonCol >
                </IonRow>
              </IonGrid>
              <br />
              <IonInput value={formValues.phoneNumber} type="tel" color="light" className='custom' fill="outline" label={t("UserScreen.EditUserDtoModal.PhoneNumber")} labelPlacement="floating" onIonInput={(e: any) => handleInputChange("phoneNumber", e.detail.value!)}></IonInput>
              <br />
              <IonInput value={formValues.streetAddress} color="light" className='custom' fill="outline" label={t("UserScreen.EditUserDtoModal.StreetAdress")} labelPlacement="floating" onIonInput={(e: any) => handleInputChange("streetAddress", e.detail.value!)}></IonInput>
              <br />
              <IonGrid className='ion-no-padding'>
                <IonRow>
                  <IonCol className='input-row-margin'>
                    <IonInput value={formValues.postalCode} color="light" className='custom' fill="outline" label={t("UserScreen.EditUserDtoModal.PostalCode")} labelPlacement="floating" onIonInput={(e: any) => handleInputChange("postalCode", e.detail.value!)}></IonInput>
                  </IonCol>
                  <IonCol >
                    <IonSelect value={formValues.country} color="light" label={t("UserScreen.EditUserDtoModal.Country")} justify="start" labelPlacement="floating" interface="popover" fill='outline' onIonChange={(e: any) => handleInputChange("country", e.detail.value!)}>
                      <IonSelectOption value="US">United States</IonSelectOption>
                      <IonSelectOption value="DE">Germany</IonSelectOption>
                      <IonSelectOption value="ES">Spain</IonSelectOption>
                    </IonSelect>
                  </IonCol>
                </IonRow>
              </IonGrid>
              <IonButton id="savebutton" expand="block" color="light" onClick={handleModalSave}>Save</IonButton>
            </div>
          </IonContent>
        </IonModal>
        <IonModal keepContentsMounted={true}>
          <IonDatetime id="date" presentation="date" ></IonDatetime>
        </IonModal>
      </IonContent>
    </IonPage>
    </Suspense>

  );
};

export default Tab4;

const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
);