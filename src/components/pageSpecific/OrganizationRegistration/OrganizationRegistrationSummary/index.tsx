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
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

// Material UI
import { Grid, Button } from '@material-ui/core';

// Custom components
import SupportPersonCard from 'components/SupportPersonCard';
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';
import OrganizationRegistrationContainer from 'components/pageSpecific/OrganizationRegistration/OrganizationRegistrationContainer';
import OrganizationRegistrationSummaryCard from 'components/pageSpecific/OrganizationRegistration/OrganizationRegistrationSummaryCard';

// Routes
import { UnauthenticatedRoutes } from 'config/routes';

// Utils
import { RootState } from 'redux/combineReducers';
import { registerOrganization } from 'redux/organizationRegistration/organizationRegistrationSlice';
interface IOrganizationRegistrationSummary {
  onHandleBack: () => void;
  onCancelRegistration: () => void;
}

const OrganizationRegistrationSummary: React.FC<IOrganizationRegistrationSummary> = (
  props: IOrganizationRegistrationSummary,
) => {
  const { onHandleBack, onCancelRegistration } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const organizationRegistrationData = useSelector(
    (state: RootState) => state.organizationRegistrationData.data,
  );

  const registerStatus = useSelector(
    (state: RootState) => state.organizationRegistrationData.registerStatus,
  );

  useEffect(() => {
    if (registerStatus.success) {
      history.push(
        UnauthenticatedRoutes.organizationRegistrationCompleteRoute.route,
      );
    }
  }, [registerStatus]);

  const onFinishRegistration = () => {
    dispatch(registerOrganization(organizationRegistrationData));
  };

  return (
    <OrganizationRegistrationContainer
      title={t('common:Summary of your request')}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <SupportPersonCard
            organizationType={organizationRegistrationData.typeId}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <OrganizationRegistrationSummaryCard />
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="flex-end" spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                disabled={registerStatus.requesting}
                onClick={onCancelRegistration}>
                {t('common:Cancel')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                disabled={registerStatus.requesting}
                onClick={onHandleBack}>
                {t('common:Back')}
              </Button>
            </Grid>
            <Grid item>
              <ButtonWithLoadingAnimation
                fullWidth
                variant="contained"
                color="primary"
                isLoading={registerStatus.requesting}
                text={t('common:Finish & send request')}
                onClick={onFinishRegistration}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </OrganizationRegistrationContainer>
  );
};

export default OrganizationRegistrationSummary;
