/** 
 * openLAMA is an open source platform which has been developed by the
 * Swiss Kanton Basel Landschaft, with the goal of automating and managing
 * large scale Covid testing programs or any other pandemic/viral infections.

 * Copyright(C) 2021 Kanton Basel Landschaft, Switzerland
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * See LICENSE.md in the project root for license information.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import i18next from 'i18next';

// Custom components
import AuthenticatedRoute from 'components/protectedRoutes/AuthenticatedRoute';
import SnackbarAlert from 'components/Snackbar';
import LazyRouteLoadingBar from 'components/loaders/LazyRouteLoadingBar/index.jsx';

// Pages
import UnauthenticatedMainPage from 'pages/Unauthenticated';

// Utils
import { Env } from 'utils/environment';

// Lazy routes
const OnboardingAndTrainingMainPage = React.lazy(
  () => import('pages/OnboardingAndTrainingAdministration'),
);

const OrganizationAdministrationMainPage = React.lazy(
  () => import('pages/OrganizationAdministration'),
);

const LabAdministrationMainPage = React.lazy(
  () => import('pages/LabAdministration'),
);

const App: React.FC = () => {
  useEffect(() => {
    if (Env.get() === 'development') {
      i18next.changeLanguage('en-US');
    } else {
      i18next.changeLanguage('de');
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <SnackbarAlert />
        <Suspense fallback={<LazyRouteLoadingBar />}>
          <Switch>
            <AuthenticatedRoute
              path="/university"
              authKey="University"
              component={OnboardingAndTrainingMainPage}
            />
            <AuthenticatedRoute
              path="/laboratory"
              authKey="Laboratory"
              component={LabAdministrationMainPage}
            />
            <AuthenticatedRoute
              path="/organization"
              authKey="Organization"
              component={OrganizationAdministrationMainPage}
            />
            <Route path="/" component={UnauthenticatedMainPage} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </>
  );
};
export default App;
