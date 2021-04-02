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

import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

// Material UI
import { Grid, Typography } from '@material-ui/core';

// Custom components
import CircularLoading from 'components/loaders/CircularLoading';

// Actions
import { getOrganizationDashboardInfo } from 'redux/organizationAdministration/organizationAdministrationDashboard/organizationAdministrationDashboardSlice';

// Utils
import {
  formatDateToMonthDotDayDotFullYear,
  getDayName,
} from 'utils/dateFNSCustom';
import { RootState } from 'redux/combineReducers';

const DashboardInfo: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const organizationId = useSelector(
    (state: RootState) => state.authData.organizationId,
  );

  const organizationDashboardData = useSelector(
    (state: RootState) => state.organizationAdministrationDashboardData,
  );

  const getOrganizationDashboardStatus = useSelector(
    (state: RootState) =>
      state.organizationAdministrationDashboardData
        .getOrganizationDashboardStatus,
  );

  useLayoutEffect(() => {
    dispatch(getOrganizationDashboardInfo({ id: organizationId }));
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          {t('common:Training and onboarding')}
        </Typography>
        {getOrganizationDashboardStatus.requesting && <CircularLoading />}
        {!getOrganizationDashboardStatus.requesting &&
        organizationDashboardData.dashboardInfo?.onboardingDate ? (
          <>
            <Typography variant="body2" gutterBottom>
              {formatDateToMonthDotDayDotFullYear(
                organizationDashboardData.dashboardInfo?.onboardingDate,
              )}
            </Typography>
            <Typography variant="body2">
              {getDayName(
                organizationDashboardData.dashboardInfo?.onboardingDate,
              )}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" gutterBottom>
            {t('common:No date yet!')}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          {t('common:Testing day')}
        </Typography>
        {getOrganizationDashboardStatus.requesting && <CircularLoading />}
        {!getOrganizationDashboardStatus.requesting &&
        (organizationDashboardData.dashboardInfo?.testDate1 ||
          organizationDashboardData.dashboardInfo?.testDate2 ||
          organizationDashboardData.dashboardInfo?.testDate3 ||
          organizationDashboardData.dashboardInfo?.testDate4 ||
          organizationDashboardData.dashboardInfo?.testDate5) ? (
          <>
            <Grid container spacing={4}>
              <Grid item>
                <Grid container direction="column">
                  {organizationDashboardData.dashboardInfo?.testDate1 && (
                    <Grid item>
                      <Typography variant="body2" gutterBottom>
                        {getDayName(
                          organizationDashboardData.dashboardInfo?.testDate1,
                        )}
                      </Typography>
                    </Grid>
                  )}
                  {organizationDashboardData.dashboardInfo?.testDate2 && (
                    <Grid item>
                      <Typography variant="body2" gutterBottom>
                        {getDayName(
                          organizationDashboardData.dashboardInfo?.testDate2,
                        )}
                      </Typography>
                    </Grid>
                  )}
                  {organizationDashboardData.dashboardInfo?.testDate3 && (
                    <Grid item>
                      <Typography variant="body2" gutterBottom>
                        {getDayName(
                          organizationDashboardData.dashboardInfo?.testDate3,
                        )}
                      </Typography>
                    </Grid>
                  )}
                  {organizationDashboardData.dashboardInfo?.testDate4 && (
                    <Grid item>
                      <Typography variant="body2" gutterBottom>
                        {getDayName(
                          organizationDashboardData.dashboardInfo?.testDate4,
                        )}
                      </Typography>
                    </Grid>
                  )}
                  {organizationDashboardData.dashboardInfo?.testDate5 && (
                    <Grid item>
                      <Typography variant="body2" gutterBottom>
                        {getDayName(
                          organizationDashboardData.dashboardInfo?.testDate5,
                        )}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid container spacing={4}>
            <Grid item>
              <Typography variant="body2">
                {t('common:No date yet!')}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default DashboardInfo;
