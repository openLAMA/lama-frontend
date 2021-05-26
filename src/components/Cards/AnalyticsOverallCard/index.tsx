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

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Material UI
import { Grid, Typography } from '@material-ui/core';

// Material Icons
import {
  BusinessOutlined as BusinessOutlinedIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
} from '@material-ui/icons';

// Custom components
import IconNumberText from 'components/IconNumberText';
import Card from 'components/Card';

// Actions
import { computeTestedOrganizations } from 'redux/globalState/charts/chartsSlice';

// Utils
import { RootState } from 'redux/combineReducers';

const AnalyticsOverallCard: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const chartsStatus = useSelector(
    (state: RootState) => state.charts.getChartsStatus,
  );

  const organizationTestedData = useSelector(
    (state: RootState) => state.charts.organizationTestedData,
  );

  useEffect(() => {
    if (chartsStatus.success) {
      dispatch(computeTestedOrganizations());
    }
  }, [chartsStatus.success]);

  return (
    <Card>
      <Grid
        container
        direction="column"
        justify="space-between"
        style={{ minHeight: '200px' }}>
        <Grid item>
          <Typography variant="h6">{t('common:Overall')}</Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={2} justify="space-between">
            <Grid item>
              <IconNumberText
                icon={BusinessOutlinedIcon}
                text={t('common:Organizations')}
                number={organizationTestedData.organizationsThatHaveStarted}
                textColor="red"
              />
            </Grid>
            <Grid item>
              <IconNumberText
                icon={PeopleAltOutlinedIcon}
                text={t('common:People')}
                number={organizationTestedData.associatedPeople}
                textColor="red"
                flexEnd
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AnalyticsOverallCard;
