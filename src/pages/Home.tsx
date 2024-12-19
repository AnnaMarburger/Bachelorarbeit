import React from 'react';
import {
  IonPage,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { Redirect, Route, useRouteMatch } from 'react-router';
import { home, bookmarks, bulb, person } from 'ionicons/icons';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import Tab4 from './Tab4';
import { useTranslation } from 'react-i18next';
import NotifScreen from './sub/NotificationScreen';
import Questionnaire from './sub/Questionnaire';
import InfoPage from './sub/InfoPage';

import "./main.css";


const Home: React.FC = () => {
  const { t } = useTranslation();
  const { url } = useRouteMatch();


  return (
    <IonPage>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path={`${url}/tab1`}>
              <Tab1 />
              </Route>
            <Route exact path={`${url}/tab2`}>
              <Tab2 />
            </Route>
            <Route path={`${url}/tab2/:questionnaireId/:instanceId/:viewOnly`} component={Questionnaire} />
            <Route exact path={`${url}/tab3`}>
              <Tab3 />
            </Route>
            <Route path={`${url}/tab3/:pageId`} component={InfoPage} />
            <Route exact path={`${url}/tab4`}>
              <Tab4 />
            </Route>
            <Route exact path={`${url}/tab4/notifs`}>
              <NotifScreen />
            </Route>
            <Route exact path={url}>
              <Redirect to={`${url}/tab1`} />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href={`${url}/tab1`}>
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>{t("Tabs.Tab1")}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href={`${url}/tab2`}>
              <IonIcon aria-hidden="true" icon={bookmarks} />
              <IonLabel>{t("Tabs.Tab2")}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href={`${url}/tab3`}>
              <IonIcon aria-hidden="true" icon={bulb} />
              <IonLabel>{t("Tabs.Tab3")}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab4" href={`${url}/tab4`}> 
              <IonIcon aria-hidden="true" icon={person} />
              <IonLabel>{t("Tabs.Tab4")}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
    </IonPage>
  );
};

export default Home;