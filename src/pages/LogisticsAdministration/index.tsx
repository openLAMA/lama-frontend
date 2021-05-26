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

import React from 'react';
import { RouteProps, Switch } from 'react-router-dom';

// Material UI
import { Container } from '@material-ui/core';

// Material Icons
import { DashboardOutlined as DashboardOutlinedIcon } from '@material-ui/icons';

// Custom components
import Navbar from 'components/NavBar';
import NavDrawer from 'components/NavDrawer';

// Routes
import { IRoute, LogisticsAdministrationRoutes } from 'config/routes';

// Utils
import TypedKeysMap from 'utils/TypedKeysMap';
import RouteMapping from 'components/protectedRoutes/RouteMapping';

import styles from './index.module.scss';

type LogisticsAdministrationMainPageType = RouteProps;

const navDrawerItemList = [
  {
    name: LogisticsAdministrationRoutes.dashboardRoute.title,
    path: LogisticsAdministrationRoutes.dashboardRoute.route,
    icon: <DashboardOutlinedIcon />,
  },
];

const LogisticsAdministrationMainPage: React.FC<LogisticsAdministrationMainPageType> = () => {
  return (
    <div className={`${styles['root']} pt-11 overflow-hidden`}>
      <Navbar />
      {/* Add props to remove logos of Navbar and/or NavDrawer. */}
      <NavDrawer navItems={navDrawerItemList} isLogistics />
      <Container
        maxWidth={false}
        className="pt-6 main-container-max-height overflow-auto">
        <Switch>
          {TypedKeysMap.typedKeys(LogisticsAdministrationRoutes).map((key) => {
            const routeItem: IRoute = LogisticsAdministrationRoutes[key];
            return (
              <RouteMapping
                exact={routeItem.exact}
                key={routeItem.key}
                path={routeItem.route}
                viewName={routeItem.viewName}
              />
            );
          })}
        </Switch>
      </Container>
    </div>
  );
};

export default LogisticsAdministrationMainPage;
