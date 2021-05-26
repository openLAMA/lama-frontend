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

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Chart } from 'chart.js';

// Utils
import { RootState } from 'redux/combineReducers';

import LoadingSwapComponent from 'components/loaders/LoadingSwapComponent';
import useWaitForRef from 'utils/customHooks/useWaitForRef';

const OrganizationsBeingTestedPieChart: React.FC = () => {
  const { t } = useTranslation();

  const chartRef = useRef(null);
  const chartRefCurrent = useWaitForRef(chartRef);
  const [chart, setChart] = useState<any>(null);

  const getChartsStatus = useSelector(
    (state: RootState) => state.charts.getChartsStatus,
  );

  const overallOrganizationsBeingTestedPieData = useSelector(
    (state: RootState) => state.charts.overallOrganizationsBeingTestedPieData,
  );

  useEffect(() => {
    if (overallOrganizationsBeingTestedPieData) {
      if (chart) {
        chart.data.labels = overallOrganizationsBeingTestedPieData.labels;
        chart.data.datasets = overallOrganizationsBeingTestedPieData.datasets;
        chart.update();
      }
    }
  }, [overallOrganizationsBeingTestedPieData]);

  useEffect(() => {
    if (getChartsStatus.success && chartRefCurrent && !chart) {
      const newChart = new Chart(chartRefCurrent, {
        type: 'pie',
        data: {
          labels: overallOrganizationsBeingTestedPieData.labels,
          datasets: overallOrganizationsBeingTestedPieData.datasets,
        },
        options: {
          aspectRatio: 1,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
      setChart(newChart);
    }
  }, [getChartsStatus.success, chartRefCurrent]);

  return (
    <LoadingSwapComponent
      isLoading={getChartsStatus.requesting}
      text={t('common:Loading chart data')}
      center>
      <div className="chart-container">
        <canvas id="organization-being-tested-pie-chart" ref={chartRef} />
      </div>
    </LoadingSwapComponent>
  );
};

export default OrganizationsBeingTestedPieChart;
