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
import { RouteProps } from 'react-router-dom';

// Material UI
import { Grid } from '@material-ui/core';

// Custom components
import PageContainerWithHeader from 'components/PageContainerWithHeader';
import MyOrganizationForm from 'components/pageSpecific/OrganizationAdministration/Forms/MyOrganizationForm';
import LoadingSwapComponent from 'components/loaders/LoadingSwapComponent';

// Actions
import { getCities } from 'redux/globalState/citiesData/citiesDataSlice';
import { getOrganizationTypes } from 'redux/globalState/organizationTypes/organizationTypesSlice';
import { getMyProfileOrganization } from 'redux/organizationAdministration/organizationAdministrationMyProfile/organizationAdministrationMyProfileSlice';

// Utils
import { RootState } from 'redux/combineReducers';

// Routes
import { OrganizationAdministrationRoutes } from 'config/routes';

type OrganizationAdministrationMyProfileType = RouteProps;

const OrganizationAdministrationMyProfile: React.FC<OrganizationAdministrationMyProfileType> = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const organizationId = useSelector(
    (state: RootState) => state.authData.organizationId,
  );

  const citiesStatus = useSelector(
    (state: RootState) => state.cities.citiesStatus,
  );

  const organizationTypesStatus = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypesStatus,
  );

  const getOrganizationStatus = useSelector(
    (state: RootState) =>
      state.organizationAdministrationMyProfileData.getOrganizationStatus,
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
    dispatch(getMyProfileOrganization({ id: organizationId }));
  }, []);

  const isLoading =
    citiesStatus.requesting ||
    organizationTypesStatus.requesting ||
    getOrganizationStatus.requesting;

  let text = '';
  if (citiesStatus.requesting) {
    text = t('progressMessages:Fetching cities');
  }
  if (organizationTypesStatus.requesting) {
    text = t('progressMessages:Fetching organization types');
  }
  if (getOrganizationStatus.requesting) {
    text = t('progressMessages:Fetching organization data');
  }
  return (
    <>
      <LoadingSwapComponent isLoading={isLoading} center text={text}>
        <MyOrganizationForm />
      </LoadingSwapComponent>
    </>
  );
};

export default OrganizationAdministrationMyProfile;
