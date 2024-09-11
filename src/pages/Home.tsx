import React, { useState } from 'react';
import {
  IonPage,
  useIonViewWillEnter,
  useIonViewDidLeave,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { Auth } from '../services/AuthService';
import { AuthActions, AuthActionBuilder } from 'ionic-appauth';
import { Redirect, Route, RouteComponentProps } from 'react-router';
import { Subscription } from 'rxjs';
import { IonReactRouter } from '@ionic/react-router';
import { home, bookmarks, bulb, person } from 'ionicons/icons';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import Tab4 from './Tab4';
import { useTranslation } from 'react-i18next';

interface HomePageProps extends RouteComponentProps {
}

const Home: React.FC<HomePageProps> = (props: HomePageProps) => {

  const [action, setAction] = useState(AuthActionBuilder.Init);
  const [user, setUser] = useState();
  const { t } = useTranslation();
  let subs: Subscription[] = [];

  useIonViewWillEnter(() => {
    console.log("home entered " + localStorage.getItem("acceptedDisclaimer"));
    subs.push(
      Auth.Instance.events$.subscribe((action) => {
        setAction(action);
        if (action.action === AuthActions.SignOutSuccess) {
          props.history.replace('landing');
        }
      }),
      Auth.Instance.user$.subscribe((user) => {
        setUser(user)
      })
    )
  });

  useIonViewDidLeave(() => {
    subs.forEach(sub => sub.unsubscribe());
    console.log("left home " + localStorage.getItem("acceptedDisclaimer"));

  });

  function handleSignOut(e: any) {
    e.preventDefault();
    Auth.Instance.signOut();
  }

  function handleRefresh(e: any) {
    e.preventDefault();
    Auth.Instance.refreshToken();
  }

  function handleGetUserDetails(e: any) {
    e.preventDefault();
    Auth.Instance.loadUserInfo();
  }

  return (
    <IonPage>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tab1">
              <Tab1 />
            </Route>
            <Route exact path="/tab2">
              <Tab2 />
            </Route>
            <Route path="/tab3">
              <Tab3 />
            </Route>
            <Route path="/tab4">
              <Tab4 />
            </Route>
            <Route exact path="/">
              <Redirect to="/tab1" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>{t("HomeScreen.Tab1")}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon aria-hidden="true" icon={bookmarks} />
              <IonLabel>{t("HomeScreen.Tab2")}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon aria-hidden="true" icon={bulb} />
              <IonLabel>{t("HomeScreen.Tab3")}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab4" href="/tab4">
              <IonIcon aria-hidden="true" icon={person} />
              <IonLabel>{t("HomeScreen.Tab4")}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonPage>
  );
};

export default Home;