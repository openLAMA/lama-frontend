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
import { RouteProps, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Material UI
import { Grid } from '@material-ui/core';

// Custom components
import PageContainerWithHeader from 'components/PageContainerWithHeader';
import EditProgramMemberForm from 'components/Forms/EditProgramMemberForm';
import LoadingSwapComponent from 'components/loaders/LoadingSwapComponent';

// Actions
import { getCities } from 'redux/globalState/citiesData/citiesDataSlice';
import { getOrganizationTypes } from 'redux/globalState/organizationTypes/organizationTypesSlice';
import { getProgramMember } from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberSlice';

// Routes
import { OnboardingAndTrainingAdministrationRoutes } from 'config/routes';

// Utils
import { RootState } from 'redux/combineReducers';

// Types
type OnboardingAndTrainingAdministrationEditProgramMemberType = RouteProps;
type reactParamsType = {
  id: string;
};

const OnboardingAndTrainingAdministrationEditProgramMember: React.FC<OnboardingAndTrainingAdministrationEditProgramMemberType> = () => {
  const dispatch = useDispatch();
  const reactParams: reactParamsType = useParams();
  const { t } = useTranslation();

  const citiesStatus = useSelector(
    (state: RootState) => state.cities.citiesStatus,
  );

  const organizationTypesStatus = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypesStatus,
  );

  const programMemberStatus = useSelector(
    (state: RootState) => state.editProgramMemberData.programMemberStatus,
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

    dispatch(getProgramMember(reactParams.id));
  }, []);

  const isLoading =
    citiesStatus.requesting ||
    organizationTypesStatus.requesting ||
    programMemberStatus.requesting;

  // TODO remove these
  const arrayOfMessages = [];
  if (citiesStatus.requesting) {
    arrayOfMessages.push(t('progressMessages:Fetching cities'));
  }

  if (organizationTypesStatus.requesting) {
    arrayOfMessages.push(t('progressMessages:Fetching organization types'));
  }

  if (programMemberStatus.requesting) {
    arrayOfMessages.push(t('progressMessages:Fetching organization data'));
  }

  return (
    <>
      <PageContainerWithHeader
        title={
          OnboardingAndTrainingAdministrationRoutes.editProgramMemberRoute.title
        }>
        <LoadingSwapComponent
          isLoading={isLoading}
          withGrid
          arrayOfMessages={arrayOfMessages}>
          <Grid item>
            <EditProgramMemberForm />
          </Grid>
        </LoadingSwapComponent>
      </PageContainerWithHeader>
    </>
  );
};

export default OnboardingAndTrainingAdministrationEditProgramMember;
