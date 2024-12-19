import React from "react";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { PrivateRoute } from './routes/PrivateRoute';

import NotFound from "./pages/NotFoundSreen";
import Home from "./pages/Home";
import LandingScreen from "./pages/LandingScreen";
import Disclaimer from "./pages/sub/Disclaimer";
import LoginScreen from "./pages/LoginScreen";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/landing" component={LandingScreen} exact />
          <Route path="/login" component={LoginScreen} exact />
          <Route path="/disclaimer" component={Disclaimer} exact />
          <Route path="/home">
            <PrivateRoute>
              <Home/>
            </PrivateRoute>
          </Route>
          <Route exact path="/">
            <Redirect to="/landing" />
          </Route>
          <Route component={NotFound} />
        </IonRouterOutlet>
      </IonReactRouter>
  </IonApp>
);

export default App;
