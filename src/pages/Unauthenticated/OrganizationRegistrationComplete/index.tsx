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
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

// Material UI
import { Grid, Typography } from '@material-ui/core';

// Material Icons
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';

// Custom components
import Card from 'components/Card';

// Routes
import { UnauthenticatedRoutes } from 'config/routes';

// Utils
import { RootState } from 'redux/combineReducers';

const OrganizationRegistrationComplete: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const registerStatus = useSelector(
    (state: RootState) => state.organizationRegistrationData.registerStatus,
  );

  if (!registerStatus.success) {
    history.push(UnauthenticatedRoutes.organizationRegistrationRoute.route);
  }

  return (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={4}>
        <Grid item>
          <CheckCircleOutlineIcon className="color-success font-size-13" />
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center">
            {t('common:Thank you for your request!')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" align="center">
            {t('common:Your request was successfully sent')}
          </Typography>
          <Typography variant="body1" align="center">
            {`${t('common:Please visit your email for activation link')}`}
          </Typography>
        </Grid>

        <Grid item xs={12} className="fullWidth">
          <Card largePadding>
            <Grid container direction="column" spacing={4} wrap="nowrap">
              <Grid item xs={12}>
                <Typography variant="h5" align="center">{`${t(
                  "common:What's next",
                )}?`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="column" spacing={2} wrap="nowrap">
                  <Grid item>
                    <Typography align="center">
                      {`${t(
                        'common:Your onboarding contact will get in touch with you within the next few days to coordinate the next steps related to the registration and training',
                      )}.`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default OrganizationRegistrationComplete;
