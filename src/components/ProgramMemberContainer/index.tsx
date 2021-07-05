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

import React, { useLayoutEffect, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Material UI
import { Grid } from '@material-ui/core';

// Custom components
import ProgramMemberFilter from 'components/ProgramMemberFilter';
import ProgramMembersTable from 'components/Tables/ProgramMembersTable';

// Actions
import {
  setFilter,
  getProgramMembers,
} from 'redux/globalState/programMembers/programMembersSlice';
import { getCities } from 'redux/globalState/citiesData/citiesDataSlice';

// Utils
import { RootState } from 'redux/combineReducers';
import programMemberStatusEnum from 'utils/programMemberStatusEnum';
import { parseISO, format } from 'date-fns';

// Types
import { ProgramMemberFilterType } from 'redux/globalState/programMembers/types';

interface IProgramMembersContainerProps {
  showEditButton?: boolean;
  isUniversityDashboard?: boolean;
  isUniversityOverview?: boolean;
  hasTypeFiltration?: boolean;
  hasStatusFiltration?: boolean;
  hasQuickFilters?: boolean;
  hasWeekdayFiltration?: boolean;
  tableHeightOffset: number;
  tableWidthOffset: number;
}

const ProgramMemberContainer: React.FC<IProgramMembersContainerProps> = (
  props: IProgramMembersContainerProps,
) => {
  const {
    showEditButton,
    isUniversityDashboard,
    isUniversityOverview,
    hasTypeFiltration,
    hasStatusFiltration,
    hasQuickFilters,
    hasWeekdayFiltration,
    tableHeightOffset,
    tableWidthOffset,
  } = props;
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.authData.userId);

  const citiesStatus = useSelector(
    (state: RootState) => state.cities.citiesStatus,
  );

  const programMembersTableData = useSelector(
    (state: RootState) => state.programMembersData.programMembers,
  );

  const followUpEmailStatus = useSelector(
    (state: RootState) => state.followUpEmail.followUpEmailStatus,
  );

  const setContractReceivedStatus = useSelector(
    (state: RootState) => state.programMembersData.setContractReceivedStatus,
  );

  const filter = useSelector(
    (state: RootState) => state.programMembersData.filter,
  );

  const setNewFilter = (filter: ProgramMemberFilterType) => {
    dispatch(setFilter(filter));
  };

  const setOrderBy = (orderBy: string) => {
    const newFilter: ProgramMemberFilterType = { ...filter };
    newFilter.orderBy = orderBy;
    setNewFilter(newFilter);
  };

  const fetchData = () => {
    const params = {
      orderBy: '',
      isAscending: false,
    };
    if (filter.orderBy) {
      params.orderBy = filter.orderBy;
      params.isAscending = filter.order === 'asc';
    }
    dispatch(getProgramMembers(params));
  };

  useLayoutEffect(() => {
    if (!citiesStatus.requesting && !citiesStatus.success) {
      dispatch(getCities());
    }
    if (isUniversityDashboard) {
      setOrderBy('LastUpdatedOn');
    }
  }, []);

  useEffect(() => {
    if (filter.orderBy) {
      fetchData();
    }
  }, [filter.orderBy, filter.order]);

  useEffect(() => {
    if (citiesStatus.success) {
      fetchData();
    }
  }, [citiesStatus]);

  useEffect(() => {
    if (followUpEmailStatus.success) {
      fetchData();
    }
  }, [followUpEmailStatus]);

  useEffect(() => {
    if (setContractReceivedStatus.success) {
      fetchData();
    }
  }, [setContractReceivedStatus]);

  let filteredResults = programMembersTableData.result;

  if (isUniversityOverview) {
    if (filter.filterEpaadStatusPending) {
      filteredResults = filteredResults.filter(
        (item) => !Boolean(item.epaadId),
      );
    }
    if (filter.filterAssignedToMe) {
      filteredResults = filteredResults.filter(
        (item) => item.supportPersonId === userId,
      );
    }
    if (filter.filterType !== -1) {
      filteredResults = filteredResults.filter(
        (item) => item.organizationTypeId === filter.filterType,
      );
    }
    if (filter.filterStatus !== 'All') {
      filteredResults = filteredResults.filter(
        (item) => item.status === filter.filterStatus,
      );
    }
    if (filter.showAllOrganizations) {
      filteredResults = filteredResults.filter(
        (item) => item.status !== programMemberStatusEnum.NotActive,
      );
    }
    if (filter.filterWeekday !== 'Weekday') {
      filteredResults = filteredResults.filter((item) => {
        if (item.firstTestTimestamp) {
          return (
            format(parseISO(item.firstTestTimestamp), `EEEE`) ===
            filter.filterWeekday
          );
        }
        return false;
      });
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProgramMemberFilter
          data={filteredResults}
          isUniversityDashboard={isUniversityDashboard}
          hasTypeFiltration={hasTypeFiltration}
          hasStatusFiltration={hasStatusFiltration}
          hasQuickFilters={hasQuickFilters}
          hasWeekdayFiltration={hasWeekdayFiltration}
        />
      </Grid>
      <Grid item xs={12} className="overflow-auto">
        <ProgramMembersTable
          data={filteredResults}
          showEditButton={showEditButton}
          tableHeightOffset={tableHeightOffset}
          tableWidthOffset={tableWidthOffset}
        />
      </Grid>
      {/* TODO maybe add the folow up modal here */}
    </Grid>
  );
};

export default ProgramMemberContainer;
