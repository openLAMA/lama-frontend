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
import { RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material UI
import { Grid } from '@material-ui/core';

// Custom components
import PageContainerWithHeader from 'components/PageContainerWithHeader';
import ProgramMemberContainer from 'components/ProgramMemberContainer';

// Utils
import { OnboardingAndTrainingAdministrationRoutes } from 'config/routes';
import { RootState } from 'redux/combineReducers';

type OnboardingAndTrainingAdministrationDashboardType = RouteProps;

const OnboardingAndTrainingAdministrationDashboard: React.FC<OnboardingAndTrainingAdministrationDashboardType> = () => {
  const roleType = useSelector((state: RootState) => state.authData.roleType);

  return (
    <>
      <PageContainerWithHeader
        title={OnboardingAndTrainingAdministrationRoutes.dashboardRoute.title}>
        <ProgramMemberContainer
          showEditButton={roleType === 'University'}
          isUniversityDashboard
          tableHeightOffset={210}
          tableWidthOffset={280}
        />
      </PageContainerWithHeader>
    </>
  );
};

export default OnboardingAndTrainingAdministrationDashboard;