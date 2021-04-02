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
import { RouteProps } from 'react-router-dom';

// Material UI
import { Grid } from '@material-ui/core';

// Custom components
import PageContainerWithHeader from 'components/PageContainerWithHeader';
import MyProfileForm from 'components/Forms/MyProfileForm';
import LoadingSwapComponent from 'components/loaders/LoadingSwapComponent';

// Utils
import { OnboardingAndTrainingAdministrationRoutes } from 'config/routes';
import { RootState } from 'redux/combineReducers';

// Actions
import { getOrganizationTypes } from 'redux/globalState/organizationTypes/organizationTypesSlice';
import { getGeneralMyProfile } from 'redux/globalState/generalMyProfile/generalMyProfileSlice';

type OnboardingAndTrainingAdministrationMyProfileType = RouteProps;

const OnboardingAndTrainingAdministrationMyProfile: React.FC<OnboardingAndTrainingAdministrationMyProfileType> = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const organizationId = useSelector(
    (state: RootState) => state.authData.organizationId,
  );

  const getGeneralMyProfileStatus = useSelector(
    (state: RootState) => state.generalMyProfile.getGeneralMyProfileStatus,
  );

  const organizationTypesStatus = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypesStatus,
  );

  useLayoutEffect(() => {
    if (
      !organizationTypesStatus.requesting &&
      !organizationTypesStatus.success
    ) {
      dispatch(getOrganizationTypes());
    }
    dispatch(getGeneralMyProfile({ id: organizationId }));
  }, []);

  const isLoading =
    getGeneralMyProfileStatus.requesting || organizationTypesStatus.requesting;

  const arrayOfMessages = [];
  if (organizationTypesStatus.requesting) {
    arrayOfMessages.push(t('progressMessages:Fetching organization types'));
  }

  if (getGeneralMyProfileStatus.requesting) {
    arrayOfMessages.push(t('progressMessages:Fetching my profile data'));
  }

  return (
    <>
      <PageContainerWithHeader
        title={OnboardingAndTrainingAdministrationRoutes.myProfileRoute.title}>
        <LoadingSwapComponent
          isLoading={isLoading}
          withGrid
          arrayOfMessages={arrayOfMessages}>
          <MyProfileForm />
        </LoadingSwapComponent>
      </PageContainerWithHeader>
    </>
  );
};
//import PageContainerWithHeader from 'components/atoms/PageContainerWithHeader';

export default OnboardingAndTrainingAdministrationMyProfile;
