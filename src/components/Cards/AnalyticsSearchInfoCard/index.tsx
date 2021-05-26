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

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Material UI
import { Grid, TextField, InputAdornment } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Material Icons
import {
  SearchOutlined as SearchOutlinedIcon,
  GroupAddOutlined as GroupAddOutlinedIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
} from '@material-ui/icons';

// Custom components
import IconNumberText from 'components/IconNumberText';
import Card from 'components/Card';

// Types
import { ProgramMemberType } from 'redux/globalState/programMembers/types';

// Utils
import { RootState } from 'redux/combineReducers';

const AnalyticsSearchInfoCard: React.FC = () => {
  const { t } = useTranslation();

  const programMembersActive = useSelector(
    (state: RootState) => state.charts.programMembersActive,
  );

  const chartsStatus = useSelector(
    (state: RootState) => state.charts.getChartsStatus,
  );

  const [searchedValue, setSearchedValue] = useState<any>(null);

  useEffect(() => {
    if (chartsStatus.success) {
      setSearchedValue(programMembersActive[0]);
    }
  }, [chartsStatus.success]);

  const getRegisteredEmployees = (programMember: ProgramMemberType | null) => {
    return programMember?.registeredEmployees || 0;
  };

  const getTotalPeople = (programMember: ProgramMemberType | null) => {
    if (programMember) {
      return programMember.numberOfSamples || 0;
    }
    return 0;
  };

  return (
    <Card>
      <Grid
        container
        direction="column"
        justify="space-between"
        style={{ minHeight: '200px' }}>
        <Grid item>
          <Autocomplete
            id="search-program-members"
            options={programMembersActive}
            value={searchedValue}
            autoSelect
            getOptionLabel={(option) => (option?.name ? option.name : '')}
            disableClearable
            onChange={(event, newValue: ProgramMemberType | null) => {
              setSearchedValue(newValue);
            }}
            loading={chartsStatus.requesting}
            renderOption={(option: ProgramMemberType) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label=""
                margin="none"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item>
          <Grid container spacing={2} justify="space-between">
            <Grid item>
              <IconNumberText
                icon={GroupAddOutlinedIcon}
                text={t('common:Number of registered employees')}
                number={getRegisteredEmployees(searchedValue)}
              />
            </Grid>
            <Grid item>
              <IconNumberText
                icon={PeopleAltOutlinedIcon}
                text={t('common:Number of employees')}
                number={getTotalPeople(searchedValue)}
                flexEnd
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AnalyticsSearchInfoCard;
