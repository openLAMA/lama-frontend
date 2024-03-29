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

// Material UI
import { Grid } from '@material-ui/core';

// Custom components
import PageContainerWithHeader from 'components/PageContainerWithHeader';
import SupportPersonCard from 'components/SupportPersonCard';
import ImportantLinks from 'components/ImportantLinks';
import DashboardInfo from 'components/pageSpecific/OrganizationAdministration/DashboardInfo';

// Routes
import { OrganizationAdministrationRoutes } from 'config/routes';
import PasswordForm from './form';

// Types
type OrganizationAdministrationDashboardType = RouteProps;

const OrganizationAdministrationDashboard: React.FC<OrganizationAdministrationDashboardType> = () => {
  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <DashboardInfo />
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <SupportPersonCard />
            </Grid>
            <Grid item xs={12} md={8}>
              <ImportantLinks />
            </Grid>
          </Grid>
        </Grid>

        <Grid>
          <PasswordForm />
        </Grid>
      </Grid>
    </>
  );
};

export default OrganizationAdministrationDashboard;
