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

import React, { useLayoutEffect, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

// Material UI
import { Button, Grid, Typography } from '@material-ui/core';

// Material Icons
import { CloseOutlined as CloseOutlinedIcon } from '@material-ui/icons';

// Custom components
import CircularLoading from 'components/loaders/CircularLoading';

// Routes
import { UnauthenticatedRoutes } from 'config/routes';

// Actions
import { confirmLogin } from 'redux/auth/authSlice';

// Utils
import { RootState } from 'redux/combineReducers';

const LoginConfirmationCard: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const { t } = useTranslation();

  const confirmLoginStatus = useSelector(
    (state: RootState) => state.auth.confirmLoginStatus,
  );
  const roleType = useSelector((state: RootState) => state.authData.roleType);

  const onRedirectToLogin = () => {
    history.push(UnauthenticatedRoutes.loginRoute.route);
  };

  useLayoutEffect(() => {
    if (token) {
      dispatch(
        confirmLogin({
          confirmationToken: token,
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (confirmLoginStatus.success && roleType) {
      history.push(`${roleType.toLowerCase()}`);
    }
  }, [confirmLoginStatus, roleType]);

  let noTokenFound;
  if (!token) {
    noTokenFound = (
      <>
        <Grid item>
          <CloseOutlinedIcon className="color-error font-size-13" />
        </Grid>
        <Grid item>
          <Typography variant="h4">{t('common:No token found!')}</Typography>
        </Grid>
      </>
    );
  }

  let tokenExpired;
  const isTokenExpired = confirmLoginStatus.failure;
  if (isTokenExpired) {
    tokenExpired = (
      <>
        <Grid item>
          <CloseOutlinedIcon className="color-error font-size-13" />
        </Grid>
        <Grid item>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}>
            <Grid item>
              <Typography variant="h4">
                {t('common:Sorry, this token is invalid!')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">
                {t('common:Please login again!')}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={onRedirectToLogin}>
                {t('common:Go to login page')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

  const data = noTokenFound || tokenExpired || <div>{t('common:Error')}</div>;

  return (
    <>
      {confirmLoginStatus.requesting ? (
        <CircularLoading withGrid size={80} text={t('Signing you in!')} />
      ) : (
        data
      )}
    </>
  );
};

export default LoginConfirmationCard;
