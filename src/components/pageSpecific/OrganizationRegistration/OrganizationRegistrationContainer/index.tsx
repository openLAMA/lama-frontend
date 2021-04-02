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

// Material UI
import { Grid, Typography } from '@material-ui/core';

interface IOrganizationRegistrationContainerProps {
  title: string;
  children: React.ReactNode;
}

const OrganizationRegistrationContainer: React.FC<IOrganizationRegistrationContainerProps> = (
  props: IOrganizationRegistrationContainerProps,
) => {
  const { title, children } = props;

  return (
    <div className="fullWidth">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default OrganizationRegistrationContainer;
