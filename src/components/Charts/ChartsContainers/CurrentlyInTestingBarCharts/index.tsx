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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Material UI
import {
  Grid,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Typography,
} from '@material-ui/core';

// Custom components
import TabPanel from 'components/TabPanel';
import Card from 'components/Card';
import OrganizationsBeingTestedChart from 'components/Charts/ChartsContainers/CurrentlyInTestingBarCharts/OrganizationsBeingTestedChart';
import PeopleBeingTestedChart from 'components/Charts/ChartsContainers/CurrentlyInTestingBarCharts/PeopleBeingTestedChart';

// Actions
import { computeCurrentlyBeingTestingBarData } from 'redux/globalState/charts/chartsSlice';

// Types
import { ChartTimePeriod } from 'redux/globalTypes';

// Utils
import { RootState } from 'redux/combineReducers';

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const showArray: ChartTimePeriod[] = ['Today', '7Days', '28Days', '90Days'];

const CurrentlyInTestingBarCharts: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [show, setShow] = useState<ChartTimePeriod>('Today');
  const [currentTab, setCurrentTab] = useState<number>(0);

  const chartsStatus = useSelector(
    (state: RootState) => state.charts.getChartsStatus,
  );

  const isChangingLanguageComplete = useSelector(
    (state: RootState) => state.languageState.isChangingLanguageComplete,
  );

  useEffect(() => {
    if (chartsStatus.success) {
      if (isChangingLanguageComplete) {
        dispatch(computeCurrentlyBeingTestingBarData(show, t));
      }
    }
  }, [chartsStatus, show, isChangingLanguageComplete]);

  const onChangeTab = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number,
  ) => {
    setCurrentTab(newValue);
  };

  const handleShowChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setShow(event.target.value as ChartTimePeriod);
  };

  return (
    <Card largePadding>
      <Grid container direction="column" spacing={2}>
        <Typography variant="h6" className="pb-6">
          {t('common:Currently in testing')}
        </Typography>
        <Tabs
          value={currentTab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label={t('aria:Line charts')}>
          <Tab label={t('common:Organizations')} {...a11yProps(0)} />
          <Tab label={t('common:People')} {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={currentTab} index={0}>
          <OrganizationsBeingTestedChart />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <PeopleBeingTestedChart />
        </TabPanel>
      </Grid>
      <Grid item>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography>{t('common:Show')}</Typography>
          </Grid>
          <Grid item>
            <Select
              labelId="show-period-bar-data-label"
              id="show-period-bar-data-select"
              value={show}
              onChange={handleShowChange}>
              <MenuItem value="Today">{t('common:Today')}</MenuItem>
              {/* {showArray.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))} */}
            </Select>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CurrentlyInTestingBarCharts;
