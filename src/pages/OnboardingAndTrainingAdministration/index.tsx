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

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RouteProps, Switch, Route, Redirect } from 'react-router-dom';

// Material UI
import { Container } from '@material-ui/core';

// Material Icons
import {
  DashboardOutlined as DashboardOutlinedIcon,
  PermIdentityOutlined as PermIdentityOutlinedIcon,
  DvrOutlined as DvrOutlinedIcon,
  PeopleOutlined as PeopleOutlinedIcon,
} from '@material-ui/icons';

// Custom components
import Navbar from 'components/NavBar';
import NavDrawer from 'components/NavDrawer';

// Routes
import {
  IRoute,
  OnboardingAndTrainingAdministrationRoutes,
} from 'config/routes';

// Pages
import NotFoundPage from 'pages/Unauthenticated/NotFound';

// Actions
import { clearAuthData } from 'redux/authData/authDataSlice';

// Utils
import TypedKeysMap from 'utils/TypedKeysMap';

import styles from './index.module.scss';
import RouteMapping from 'components/protectedRoutes/RouteMapping';

type OnboardingAndTrainingMainPageType = RouteProps;

const navDrawerItemList = [
  {
    name: OnboardingAndTrainingAdministrationRoutes.dashboardRoute.title,
    path: OnboardingAndTrainingAdministrationRoutes.dashboardRoute.route,
    icon: <DashboardOutlinedIcon />,
  },
  {
    name: OnboardingAndTrainingAdministrationRoutes.overviewRoute.title,
    path: OnboardingAndTrainingAdministrationRoutes.overviewRoute.route,
    icon: <DvrOutlinedIcon />,
  },
  {
    name: OnboardingAndTrainingAdministrationRoutes.capacityRoute.title,
    path: OnboardingAndTrainingAdministrationRoutes.capacityRoute.route,
    icon: <PeopleOutlinedIcon />,
  },
  {
    name: OnboardingAndTrainingAdministrationRoutes.myProfileRoute.title,
    path: OnboardingAndTrainingAdministrationRoutes.myProfileRoute.route,
    icon: <PermIdentityOutlinedIcon />,
  },
];

const OnboardingAndTrainingMainPage: React.FC<OnboardingAndTrainingMainPageType> = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (
      location?.pathname.includes('login-confirmation') ||
      location?.pathname.includes('register-confirmation')
    ) {
      dispatch(clearAuthData());
    }
  }, []);

  return (
    <div className={`${styles['root']} pt-11 overflow-hidden`}>
      <Navbar />
      <NavDrawer navItems={navDrawerItemList} />
      <Container
        maxWidth={false}
        className="pt-6 main-container-max-height overflow-auto">
        <Switch>
          {TypedKeysMap.typedKeys(
            OnboardingAndTrainingAdministrationRoutes,
          ).map((key) => {
            const routeItem: IRoute =
              OnboardingAndTrainingAdministrationRoutes[key];
            return (
              <RouteMapping
                exact={routeItem.exact}
                key={routeItem.key}
                path={routeItem.route}
                viewName={routeItem.viewName}
              />
            );
          })}
          {location.pathname === '/' && (
            <Redirect
              to={
                OnboardingAndTrainingAdministrationRoutes.dashboardRoute.route
              }
            />
          )}
          <Route component={NotFoundPage} />
        </Switch>
      </Container>
    </div>
  );
};

export default OnboardingAndTrainingMainPage;
