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
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

// Routes
import { UnauthenticatedRoutes } from 'config/routes';

// utils
import { RootState } from 'redux/combineReducers';

interface AuthenticatedRouteProps extends RouteProps {
  authKey?: string;
  path: string;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = (
  props: AuthenticatedRouteProps,
) => {
  const { authKey, component, ...rest } = props;

  const token = useSelector((state: RootState) => state.authData.token);
  const roleType = useSelector((state: RootState) => state.authData.roleType);

  if (!token) {
    return (
      <Redirect
        exact
        to={{
          pathname: UnauthenticatedRoutes.loginRoute.route,
        }}
      />
    );
  }

  if (authKey && roleType !== authKey) {
    return (
      <Redirect
        exact
        to={{
          pathname: `/${roleType.toLowerCase()}`,
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Route {...rest} component={component} />
  );
};

export default AuthenticatedRoute;
