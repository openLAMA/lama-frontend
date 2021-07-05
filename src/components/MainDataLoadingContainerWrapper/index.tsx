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

import { useSelector, useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

// Material UI
import { Container, Grid, Typography } from '@material-ui/core';

// Custom components
import CircularLoading from 'components/loaders/CircularLoading';

// Actions
import { getCities } from 'redux/globalState/citiesData/citiesDataSlice';
import { getOrganizationTypes } from 'redux/globalState/organizationTypes/organizationTypesSlice';

// Utils
import { RootState } from 'redux/combineReducers';

interface IMainDataLoadingContainerWrapperProps {
  children: React.ReactNode;
}

const MainDataLoadingContainerWrapper: React.FC<IMainDataLoadingContainerWrapperProps> = (
  props: IMainDataLoadingContainerWrapperProps,
) => {
  const { children } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const citiesStatus = useSelector(
    (state: RootState) => state.cities.citiesStatus,
  );
  const organizationTypesStatus = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypesStatus,
  );

  useLayoutEffect(() => {
    if (!citiesStatus.requesting && !citiesStatus.success) {
      dispatch(getCities());
    }
    if (
      !organizationTypesStatus.requesting &&
      !organizationTypesStatus.success
    ) {
      dispatch(getOrganizationTypes());
    }
  }, []);

  if (citiesStatus.requesting || organizationTypesStatus.requesting) {
    return (
      <Container className="fullWidth height100vh">
        <Grid
          container
          className="fullWidth fullHeight"
          justify="center"
          alignItems="center">
          <Grid item>
            <CircularLoading center text={t('common:Loading')} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (citiesStatus.success || organizationTypesStatus.success) {
    return <>{children}</>;
  }

  if (citiesStatus.failure || organizationTypesStatus.failure) {
    return (
      <Typography align="center" variant="h2">
        Failed to fetch data from API!
      </Typography>
    );
  }

  return <></>;
};

export default MainDataLoadingContainerWrapper;
