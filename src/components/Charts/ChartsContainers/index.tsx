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
import { useDispatch } from 'react-redux';
import { Chart, registerables } from 'chart.js';

// Material UI
import { Grid } from '@material-ui/core';

// Custom components
import AnalyticsSearchInfoCard from 'components/Cards/AnalyticsSearchInfoCard';
import CurrentlyInTestingBarCharts from './CurrentlyInTestingBarCharts';
import OverallBeingTestingPieCharts from './OverallBeingTestingPieCharts';

// Actions
import { getChartsData } from 'redux/globalState/charts/chartsSlice';

// Utils
import AnalyticsOverallCard from 'components/Cards/AnalyticsOverallCard';

// IMPORTANT, this registers the Charts for whole project, needs to be done once.
Chart.register(...registerables);

const ProgramMemberContainer: React.FC = () => {
  const dispatch = useDispatch();

  const fetchData = () => {
    const params = {
      orderBy: 'createdOn',
      isAscending: true,
    };
    dispatch(getChartsData(params));
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <AnalyticsOverallCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsSearchInfoCard />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <CurrentlyInTestingBarCharts />
      </Grid>

      <Grid item xs={12} md={6}>
        <OverallBeingTestingPieCharts />
      </Grid>
    </Grid>
  );
};

export default ProgramMemberContainer;
