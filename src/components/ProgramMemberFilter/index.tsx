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

import React, { useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { CSVLink } from 'react-csv';

// Material UI

import {
  Grid,
  MenuItem,
  FormLabel,
  Link,
  FormControlLabel,
  Switch,
} from '@material-ui/core';

// Custom components
import CustomSelect from 'components/CustomSelect';
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';

// Actions
import { setFilter } from 'redux/globalState/programMembers/programMembersSlice';
import { getCities } from 'redux/globalState/citiesData/citiesDataSlice';
import { getOrganizationTypes } from 'redux/globalState/organizationTypes/organizationTypesSlice';

// Types
import {
  ProgramMemberFilterType,
  ProgramMemberType,
} from 'redux/globalState/programMembers/types';

// Utils
import { RootState } from 'redux/combineReducers';
import { findCity } from 'utils/findCity';
import programMemberStatusEnum from 'utils/programMemberStatusEnum';
import {
  formatDateToMonthDayFullYear,
  formatDateToMonthDotDayDotFullYear,
  getDayName,
} from 'utils/dateFNSCustom';

interface IProgramMembersFilterProps {
  data: ProgramMemberType[];
  isUniversityDashboard?: boolean;
  hasTypeFiltration?: boolean;
  hasStatusFiltration?: boolean;
  hasQuickFilters?: boolean;
  hasWeekdayFiltration?: boolean;
}

const ProgramMemberFilter: React.FC<IProgramMembersFilterProps> = (
  props: IProgramMembersFilterProps,
) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    data,
    isUniversityDashboard,
    hasTypeFiltration,
    hasStatusFiltration,
    hasQuickFilters,
    hasWeekdayFiltration,
  } = props;

  const csvRef = useRef<any | null>(null);

  const filter = useSelector(
    (state: RootState) => state.programMembersData.filter,
  );

  const citiesStatus = useSelector(
    (state: RootState) => state.cities.citiesStatus,
  );

  const organizationTypesStatus = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypesStatus,
  );

  const programMembersStatus = useSelector(
    (state: RootState) => state.programMembersData.programMembersStatus,
  );

  const organizationTypesList = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypes,
  );

  const citiesList = useSelector((state: RootState) => state.cities.cities);

  useLayoutEffect(() => {
    if (!citiesStatus.requesting && !citiesStatus.success) {
      dispatch(getCities());
    }
    if (
      !organizationTypesStatus.requesting &&
      !organizationTypesStatus.success
    ) {
      dispatch(getOrganizationTypes());
    }
  }, []);

  const setNewFilter = (filter: ProgramMemberFilterType) => {
    dispatch(setFilter(filter));
  };

  let isNoFilterApplied = true;
  if (filter.filterType !== -1) {
    isNoFilterApplied = false;
  }
  if (isNoFilterApplied && filter.filterStatus !== 'All') {
    isNoFilterApplied = false;
  }
  if (isNoFilterApplied && filter.filterEpaadStatusPending) {
    isNoFilterApplied = false;
  }
  if (isNoFilterApplied && filter.filterAssignedToMe) {
    isNoFilterApplied = false;
  }
  if (isNoFilterApplied && filter.filterWeekday !== 'Weekday') {
    isNoFilterApplied = false;
  }

  const setFilterType = (filterType: number) => {
    const newFilter: ProgramMemberFilterType = { ...filter };
    newFilter.filterType = filterType;
    setNewFilter(newFilter);
  };

  const setFilterStatus = (filterStatus: string) => {
    const newFilter: ProgramMemberFilterType = { ...filter };
    newFilter.filterStatus = filterStatus;
    setNewFilter(newFilter);
  };

  const setFilterWeekday = (filterWeekDay: string) => {
    const newFilter: ProgramMemberFilterType = { ...filter };
    newFilter.filterWeekday = filterWeekDay;
    setNewFilter(newFilter);
  };

  const setFilterEpaadStatusPending = (filterEpaadStatusPending: boolean) => {
    const newFilter: ProgramMemberFilterType = { ...filter };
    newFilter.filterEpaadStatusPending = filterEpaadStatusPending;
    setNewFilter(newFilter);
  };

  const setFilterAssignedToMe = (filterAssignedToMe: boolean) => {
    const newFilter: ProgramMemberFilterType = { ...filter };
    newFilter.filterAssignedToMe = filterAssignedToMe;
    setNewFilter(newFilter);
  };

  const setDisabledOrganizations = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newFilter: ProgramMemberFilterType = { ...filter };
    newFilter.showAllOrganizations = event.target.checked;
    setNewFilter(newFilter);
  };

  const statusMenuItems = [
    { value: 'All', text: t('common:All') },
    { value: 'PendingContact', text: t('common:Pending contacts') },
    { value: 'TrainingDateSet', text: t('common:Training date set') },
    { value: 'PendingOnboarding', text: t('common:Pending onboarding') },
    { value: 'Onboarded', text: t('common:Onboarded') },
    { value: 'NotActive', text: t('common:Not active') },
  ];

  const weekdayMenuItems = [
    { value: 'Weekday', text: t('common:Weekday') },
    { value: 'Monday', text: t('common:Monday') },
    { value: 'Tuesday', text: t('common:Tuesday') },
    { value: 'Wednesday', text: t('common:Wednesday') },
    { value: 'Thursday', text: t('common:Thursday') },
    { value: 'Friday', text: t('common:Friday') },
    { value: 'Saturday', text: t('common:Saturday') },
    { value: 'Sunday', text: t('common:Sunday') },
  ];

  const organizationTypesMenuItems = [
    { value: -1, text: 'All' },
    ...organizationTypesList.map((orgType) => {
      return {
        value: orgType.id,
        text: orgType.name,
      };
    }),
  ];

  const handleShowAll = () => {
    const newFilter: ProgramMemberFilterType = {
      order: 'desc',
      orderBy: isUniversityDashboard ? 'LastUpdatedOn' : '',
      filterStatus: 'All',
      filterType: -1,
      filterEpaadStatusPending: false,
      filterAssignedToMe: false,
      filterWeekday: 'Weekday',
      showAllOrganizations: true,
    };
    setNewFilter(newFilter);
  };

  const handleFilterEpaadStatusPending = () => {
    setFilterEpaadStatusPending(!filter.filterEpaadStatusPending);
  };

  const handleFilterAssignedToMe = () => {
    setFilterAssignedToMe(!filter.filterAssignedToMe);
  };

  const onExportToCSV = () => {
    if (csvRef?.current) {
      csvRef?.current?.link?.click();
    }
  };

  const dataCsv = data
    .filter(
      (item: ProgramMemberType) =>
        item.status !== programMemberStatusEnum.NotActive,
    )
    .map((item: ProgramMemberType) => {
      return {
        type: t(`common:${item.organizationType.name}`),
        status: t(`common:${item.status}`),
        epaadstatus: item.epaadId ? t('common:Completed') : t('common:Pending'),
        supportPerson: item.supportPerson.name,
        createdOn: item.createdOn,
        name: item.name,
        organizationShortcutName: item.organizationShortcutName,
        contactPerson: item.contacts.map((contact: any) => {
          return contact.name;
        }),
        email: item.contacts.map((contact: any) => {
          return contact.email;
        }),
        phone: item.contacts.map((contact: any) => {
          return contact.phoneNumber;
        }),
        studentsCount: item.studentsCount,
        employeesCount: item.employeesCount,
        numberOfSamples: item.numberOfSamples,
        registeredEmployees: item.registeredEmployees,
        trainingTimestamp: formatDateToMonthDotDayDotFullYear(
          item.trainingTimestamp,
        ),
        onboardingTimestamp: formatDateToMonthDotDayDotFullYear(
          item.onboardingTimestamp,
        ),
        firstTestTimestamp: formatDateToMonthDotDayDotFullYear(
          item.firstTestTimestamp,
        ),
        testingDay: getDayName(item.firstTestTimestamp),
        area: item.area,
        address: item.address,
        zip: item.zip,
        city: findCity(citiesList, item.cityId)?.name || '-',
        schoolType: item.schoolType,
        manager: item.manager,
        prioLogistic: item.prioLogistic,
        numberOfBags: item.numberOfBags,
        naclLosing: item.naclLosing,
        additionalTestTubes: item.additionalTestTubes,
        numberOfRakoBoxes: item.numberOfRakoBoxes,
      };
    });

  const headers = [
    { key: 'type', label: t('common:Type') },
    {
      key: 'status',
      label: t('common:Status'),
    },
    {
      key: 'epaadstatus',
      label: t('common:Epaad Status'),
    },
    {
      key: 'supportPerson',
      label: t('common:Support person'),
    },
    {
      key: 'createdOn',
      label: t('common:Created on date'),
    },
    {
      key: 'name',
      label: t('common:Name of the organization'),
    },
    {
      key: 'organizationShortcutName',
      label: t('common:Organization key'),
    },
    { key: 'contactPerson', label: t('common:Contact person') },

    { key: 'email', label: t('common:Email') },
    { key: 'phone', label: t('common:Mobile phone number') },
    {
      key: 'studentsCount',
      label: t('common:Number of students'),
    },
    {
      key: 'employeesCount',
      label: t('common:Number of employees'),
    },
    {
      key: 'numberOfSamples',
      label: t('common:Total people'),
    },
    {
      key: 'registeredEmployees',
      label: t('common:Number of registered employees'),
    },
    {
      key: 'trainingTimestamp',
      label: t('common:Information event date'),
    },
    {
      key: 'onboardingTimestamp',
      label: t('common:Onboarding date'),
    },
    {
      key: 'firstTestTimestamp',
      label: t('common:Starting date'),
    },
    {
      key: 'testingDay',
      label: t('common:Testing day'),
    },
    { key: 'area', label: t('common:Area') },
    { key: 'address', label: t('common:Street') },
    { key: 'zip', label: t('common:ZIP code') },
    { key: 'city', label: t('common:City') },
    {
      key: 'schoolType',
      label: t('common:School type'),
    },
    { key: 'manager', label: t('common:Manager') },
    {
      key: 'prioLogistic',
      label: t('common:Prio logistik'),
    },
    {
      key: 'numberOfBags',
      label: t('common:Number of bags'),
    },
    {
      key: 'naclLosing',
      label: t('common:NaCL losing'),
    },
    {
      key: 'additionalTestTubes',
      label: t('common:Additional test tubes'),
    },
    {
      key: 'numberOfRakoBoxes',
      label: t('common:Number Of Rako boxes'),
    },
  ];

  let noFilters = true;
  if (
    hasTypeFiltration ||
    hasStatusFiltration ||
    hasQuickFilters ||
    hasWeekdayFiltration
  ) {
    noFilters = false;
  }

  return (
    <Grid container spacing={2}>
      {!noFilters && (
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="flex-end">
            {hasTypeFiltration && (
              <Grid item>
                <CustomSelect
                  fullWidth
                  className="width-200"
                  error={Boolean(filter.filterType !== -1)}
                  labelId="type-filter-select-label"
                  label={t('common:Type')}
                  selectId="type-filter-select"
                  value={filter.filterType}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setFilterType(event.target.value as number);
                  }}
                  menuItems={organizationTypesMenuItems.map((orgType) => (
                    <MenuItem key={orgType.value} value={orgType.value}>
                      {t(`common:${orgType.text}`)}
                    </MenuItem>
                  ))}
                />
              </Grid>
            )}
            {hasStatusFiltration && (
              <Grid item>
                <CustomSelect
                  fullWidth
                  className="width-200"
                  error={Boolean(filter.filterStatus !== 'All')}
                  labelId="status-filter-select-label"
                  label={t('common:Status')}
                  selectId="status-filter-select"
                  value={filter.filterStatus}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setFilterStatus(event.target.value as string);
                  }}
                  menuItems={statusMenuItems.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.text}
                    </MenuItem>
                  ))}
                />
              </Grid>
            )}
            {hasWeekdayFiltration && (
              <Grid item>
                <CustomSelect
                  fullWidth
                  className="width-200"
                  error={Boolean(filter.filterWeekday !== 'Weekday')}
                  labelId="weekday-filter-select-label"
                  label={t('common:Weekday')}
                  selectId="weekday-filter-select"
                  value={filter.filterWeekday}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setFilterWeekday(event.target.value as string);
                  }}
                  menuItems={weekdayMenuItems.map((weekDay) => (
                    <MenuItem key={weekDay.value} value={weekDay.value}>
                      {weekDay.text}
                    </MenuItem>
                  ))}
                />
              </Grid>
            )}

            {hasQuickFilters && (
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Grid container direction="column" className="pb-2">
                      <Grid
                        item
                        style={{
                          paddingBottom: '10px',
                        }}>
                        <FormLabel className="font-size-zero75rem">
                          {t('common:Quick filters')}
                        </FormLabel>
                      </Grid>
                      <Grid item>
                        <Grid container spacing={2}>
                          <Grid item>
                            <Link
                              component="button"
                              underline="always"
                              className={`${
                                !isNoFilterApplied && 'color-gray'
                              }`}
                              onClick={handleShowAll}>
                              {t('common:Show all')}
                            </Link>
                          </Grid>
                          <Grid item>
                            <Link
                              component="button"
                              underline="always"
                              className={`${
                                !filter.filterEpaadStatusPending && 'color-gray'
                              }`}
                              onClick={handleFilterEpaadStatusPending}>
                              {t('common:Pending')}
                            </Link>
                          </Grid>
                          <Grid item>
                            <Link
                              component="button"
                              underline="always"
                              className={`${
                                !filter.filterAssignedToMe && 'color-gray'
                              }`}
                              onClick={handleFilterAssignedToMe}>
                              {t('common:Assigned to me')}
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label={t('common:Only active organizations')}
                      classes={{
                        root: 'align-start pb-1',
                        label:
                          'font-size-zero75rem custom-switch-label-color pb-1',
                      }}
                      control={
                        <Switch
                          checked={filter.showAllOrganizations}
                          color="primary"
                          onChange={setDisabledOrganizations}
                          size="small"
                        />
                      }
                      labelPlacement="top"
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      <Grid item xs={12}>
        <ButtonWithLoadingAnimation
          variant="contained"
          color="primary"
          onClick={onExportToCSV}
          text={t('common:Export to CSV')}
          disabled={programMembersStatus.requesting}
        />
        <CSVLink
          ref={csvRef}
          data={dataCsv}
          headers={headers}
          filename={`Lama_${formatDateToMonthDayFullYear(new Date())}.csv`}
        />
      </Grid>
    </Grid>
  );
};

export default ProgramMemberFilter;
