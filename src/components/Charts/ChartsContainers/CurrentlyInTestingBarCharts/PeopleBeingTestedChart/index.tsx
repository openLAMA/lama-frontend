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

const PeopleBeingTestedChart: React.FC = () => {
  const { t } = useTranslation();

  const chartRef = useRef(null);
  const chartRefCurrent = useWaitForRef(chartRef);
  const [chart, setChart] = useState<Chart | null>(null);

  const getChartsStatus = useSelector(
    (state: RootState) => state.charts.getChartsStatus,
  );

  const peopleBeingTestedData = useSelector(
    (state: RootState) => state.charts.peopleBeingTestedData,
  );

  useEffect(() => {
    if (peopleBeingTestedData) {
      if (chart) {
        chart.data.labels = peopleBeingTestedData.labels;
        chart.data.datasets = peopleBeingTestedData.datasets;
        chart.update();
      }
    }
  }, [peopleBeingTestedData]);

  useEffect(() => {
    if (getChartsStatus.success && chartRefCurrent && !chart) {
      const newChart = new Chart(chartRefCurrent, {
        type: 'bar',
        data: {
          labels: peopleBeingTestedData.labels,
          datasets: peopleBeingTestedData.datasets,
        },
        options: {
          aspectRatio: 1,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: {
              position: 'top',
            },
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
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
        <canvas id="people-being-tested-chart" ref={chartRef} />
      </div>
    </LoadingSwapComponent>
  );
};

export default PeopleBeingTestedChart;
