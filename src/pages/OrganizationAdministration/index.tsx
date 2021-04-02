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
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { RouteProps, Switch } from 'react-router-dom';

// Material UI
import { Container } from '@material-ui/core';

// Material Icons
import {
  DashboardOutlined as DashboardOutlinedIcon,
  PermIdentityOutlined as PermIdentityOutlinedIcon,
} from '@material-ui/icons';

// Custom components
import Navbar from 'components/NavBar';
import NavDrawer from 'components/NavDrawer';

// Routes
import { IRoute, OrganizationAdministrationRoutes } from 'config/routes';

// Actions
import { clearAuthData } from 'redux/authData/authDataSlice';

// Utils
import TypedKeysMap from 'utils/TypedKeysMap';
import { RootState } from 'redux/combineReducers';

import styles from './index.module.scss';
import RouteMapping from 'components/protectedRoutes/RouteMapping';

type OrganizationAdministrationMainPageType = RouteProps;

const navDrawerItemList = [
  {
    name: OrganizationAdministrationRoutes.dashboardRoute.title,
    path: OrganizationAdministrationRoutes.dashboardRoute.route,
    icon: <DashboardOutlinedIcon />,
  },
  {
    name: OrganizationAdministrationRoutes.myProfileRoute.title,
    path: OrganizationAdministrationRoutes.myProfileRoute.route,
    icon: <PermIdentityOutlinedIcon />,
  },
];

const OrganizationAdministrationMainPage: React.FC<OrganizationAdministrationMainPageType> = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  if (
    location?.pathname.includes('login-confirmation') ||
    location?.pathname.includes('register-confirmation')
  ) {
    dispatch(clearAuthData());
  }

  const confirmLoginStatus = useSelector(
    (state: RootState) => state.auth.confirmLoginStatus,
  );

  const confirmRegistrationStatus = useSelector(
    (state: RootState) => state.auth.confirmRegistrationStatus,
  );

  useEffect(() => {
    if (confirmLoginStatus.success || confirmRegistrationStatus.success) {
      history.push(OrganizationAdministrationRoutes.dashboardRoute.route);
    }
  }, [confirmLoginStatus, confirmRegistrationStatus]);

  return (
    <div className={`${styles['root']} pt-11 pt-11 overflow-hidden`}>
      <Navbar />
      <NavDrawer navItems={navDrawerItemList} />
      <Container
        maxWidth={false}
        className="pt-6 main-container-max-height overflow-auto">
        <Switch>
          {TypedKeysMap.typedKeys(OrganizationAdministrationRoutes).map(
            (key) => {
              const routeItem: IRoute = OrganizationAdministrationRoutes[key];
              return (
                <RouteMapping
                  exact={routeItem.exact}
                  key={routeItem.key}
                  path={routeItem.route}
                  viewName={routeItem.viewName}
                />
              );
            },
          )}
        </Switch>
      </Container>
    </div>
  );
};

export default OrganizationAdministrationMainPage;
