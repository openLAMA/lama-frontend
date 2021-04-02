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

import { RouteProps, Switch, Route } from 'react-router-dom';

// Material UI
import { Container, Grid } from '@material-ui/core';

// Atmos
import CompanyLogo from 'components/CompanyLogo';
import UnauthenticatedRoute from 'components/protectedRoutes/UnauthenticatedRoute';

// Routes
import { IRoute, UnauthenticatedRoutes } from 'config/routes';

// Pages
import NotFoundPage from 'pages/Unauthenticated/NotFound';

// Utils
import TypedKeysMap from 'utils/TypedKeysMap';

type UnauthenticatedMainPageType = RouteProps;

const UnauthenticatedMainPage: React.FC<UnauthenticatedMainPageType> = () => {
  return (
    <Container className="height100vh" maxWidth="lg">
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className="fullHeight">
        <Grid item xs={12}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            wrap="nowrap"
            spacing={3}>
            <Grid item>
              <CompanyLogo />
            </Grid>
            <Grid item className="max-width-924 fullWidth">
              <Switch>
                {TypedKeysMap.typedKeys(UnauthenticatedRoutes).map((key) => {
                  const routeItem: IRoute = UnauthenticatedRoutes[key];
                  return (
                    <UnauthenticatedRoute
                      exact={routeItem.exact}
                      key={routeItem.key}
                      path={routeItem.route}
                      viewName={routeItem.viewName}
                      redirectIfAuth={routeItem.redirectIfAuth}
                    />
                  );
                })}
                <Route component={NotFoundPage} />
              </Switch>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UnauthenticatedMainPage;
