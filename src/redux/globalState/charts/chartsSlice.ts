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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'redux/store';
import { TFunction } from 'i18next';
import { extractErrorMessage } from 'apiService/axiosInstance';
import {
  isEqual,
  min,
  sub,
  isAfter,
  parseISO,
  getWeek,
  eachDayOfInterval,
  isToday,
  isBefore,
  isFuture,
  isPast,
  getDay,
} from 'date-fns';

import callSnackbar from 'utils/customHooks/useSnackbar';
import { getDayName } from 'utils/dateFNSCustom';

// Types
import { ChartTimePeriod, IApiStatus } from 'redux/globalTypes';
import { ProgramMemberType } from 'redux/globalState/programMembers/types';
import {
  GetChartsDataRequestType,
  GetChartsDataResponseType,
  OrganizationTestedDataType,
  ChartDataType,
} from 'redux/globalState/charts/types';
import { ErrorObjectType } from 'apiService/types';

import { getChartsDataAPI } from 'redux/globalState/charts/chartsApi';

// utils
import organizationTypesEnum from 'utils/organizationTypesEnum';
import programMemberStatusEnum from 'utils/programMemberStatusEnum';

interface ICharts {
  getChartsStatus: IApiStatus;
  programMembersRawData: ProgramMemberType[];
  programMembersActive: ProgramMemberType[];
  organizationTestedData: OrganizationTestedDataType;
  organizationsBeingTestedData: ChartDataType;
  peopleBeingTestedData: ChartDataType;
  overallOrganizationsBeingTestedPieData: ChartDataType;
  overallPeopleBeingTestedPieData: ChartDataType;
}

const initialState = {
  getChartsStatus: {
    requesting: true,
    success: false,
    failure: false,
  },
  programMembersRawData: [],
  programMembersActive: [],
  organizationTestedData: {
    organizationsThatHaveStarted: 0,
    associatedPeople: 0,
  },
  organizationsBeingTestedData: {
    labels: [],
    datasets: [],
  },
  peopleBeingTestedData: {
    labels: [],
    datasets: [],
  },
  overallOrganizationsBeingTestedPieData: {
    labels: [],
    datasets: [],
  },
  overallPeopleBeingTestedPieData: {
    labels: [],
    datasets: [],
  },
} as ICharts;

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    getChartsRequesting(state) {
      state.getChartsStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getChartsSuccess(state, action: PayloadAction<GetChartsDataResponseType>) {
      state.getChartsStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
      state.programMembersRawData = action.payload.result;
      state.programMembersActive = action.payload.result.filter(
        (programMember) =>
          programMember.status !== programMemberStatusEnum.NotActive,
      );
    },
    getChartsFailed(state) {
      state.getChartsStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    testedOrganizations(
      state,
      action: PayloadAction<OrganizationTestedDataType>,
    ) {
      state.organizationTestedData = action.payload;
    },
    setOrganizationsBeingTestedData(
      state,
      action: PayloadAction<ChartDataType>,
    ) {
      state.organizationsBeingTestedData = action.payload;
    },
    setPeopleBeingTestedData(state, action: PayloadAction<ChartDataType>) {
      state.peopleBeingTestedData = action.payload;
    },
    setOverallOrganizationsBeingTestedPieData(
      state,
      action: PayloadAction<ChartDataType>,
    ) {
      state.overallOrganizationsBeingTestedPieData = action.payload;
    },
    setOverallPeopleBeingTestedPieData(
      state,
      action: PayloadAction<ChartDataType>,
    ) {
      state.overallPeopleBeingTestedPieData = action.payload;
    },
  },
});

export const {
  getChartsRequesting,
  getChartsSuccess,
  getChartsFailed,
  testedOrganizations,
  setOrganizationsBeingTestedData,
  setPeopleBeingTestedData,
  setOverallOrganizationsBeingTestedPieData,
  setOverallPeopleBeingTestedPieData,
} = chartsSlice.actions;

export default chartsSlice.reducer;

export const getChartsData = (
  data: GetChartsDataRequestType,
): AppThunk => async (dispatch) => {
  dispatch(getChartsRequesting());
  getChartsDataAPI(data).then(
    (response: GetChartsDataResponseType): void => {
      dispatch(getChartsSuccess(response));
    },
    (error: ErrorObjectType): void => {
      dispatch(getChartsFailed());
      extractErrorMessage(error, 'Failed to get charts data!');
    },
  );
};

export const computeTestedOrganizations = (): AppThunk => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const { programMembersRawData } = state.charts;
  if (programMembersRawData.length !== 0) {
    const filteredOrganizations = programMembersRawData.filter((item) => {
      if (item.status === programMemberStatusEnum.NotActive) return false;
      if (item.firstTestTimestamp) {
        const firstTestingDate = parseISO(item.firstTestTimestamp);
        if (isToday(firstTestingDate)) {
          return true;
        }
        if (isPast(firstTestingDate)) {
          return true;
        }
      }
      return false;
    });
    const organizationTestedData = {
      organizationsThatHaveStarted: filteredOrganizations.length,
      associatedPeople: filteredOrganizations.reduce<number>(
        (peopleCount, item) => {
          let newPeopleCount = peopleCount;
          if (item.organizationTypeId === organizationTypesEnum.School) {
            newPeopleCount += item.numberOfSamples || 0;
          } else {
            newPeopleCount += item.registeredEmployees || 0;
          }
          return newPeopleCount;
        },
        0,
      ),
    };
    dispatch(testedOrganizations(organizationTestedData));
  }
};

const getChartColorShade = (index: number): string => {
  switch (index) {
    case 0:
      return '#8626ED';
    case 1:
      return '#F900B4';
    case 2:
      return '#FF237A';
    case 3:
      return '#FF814F';
    case 4:
      return '#FFC244';
    case 5:
      return '#F9F871';
    default:
      return '';
  }
};

const checkIfTestingDateIsTodayOrInThePastAndTodayAsDay = (
  today: Date,
  data?: string | null,
): boolean => {
  if (data) {
    const parsedDate = parseISO(data);
    if (isToday(parsedDate)) {
      if (getDay(parsedDate) === getDay(today)) {
        return true;
      }
    }
    if (isPast(parsedDate)) {
      if (getDay(parsedDate) === getDay(today)) {
        return true;
      }
    }
  }
  return false;
};

export const computeCurrentlyBeingTestingBarData = (
  period: ChartTimePeriod,
  t: TFunction,
): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const { programMembersActive } = state.charts;
  const { organizationTypes } = state.organizationTypes;
  if (programMembersActive.length !== 0) {
    if (period === 'Today') {
      const today = new Date();
      const filterFirstTestDateAndOlder = programMembersActive.filter(
        (item) => {
          if (item.status === programMemberStatusEnum.NotActive) return false;
          if (item.firstTestTimestamp) {
            const firstTestingDate = parseISO(item.firstTestTimestamp);
            if (isToday(firstTestingDate)) {
              if (getDay(firstTestingDate) === getDay(today)) {
                return true;
              }
            }
            if (isPast(firstTestingDate)) {
              if (getDay(firstTestingDate) === getDay(today)) {
                return true;
              }
              if (
                checkIfTestingDateIsTodayOrInThePastAndTodayAsDay(
                  today,
                  item.secondTestTimestamp,
                ) ||
                checkIfTestingDateIsTodayOrInThePastAndTodayAsDay(
                  today,
                  item.thirdTestTimestamp,
                ) ||
                checkIfTestingDateIsTodayOrInThePastAndTodayAsDay(
                  today,
                  item.fourthTestTimestamp,
                ) ||
                checkIfTestingDateIsTodayOrInThePastAndTodayAsDay(
                  today,
                  item.fourthTestTimestamp,
                ) ||
                checkIfTestingDateIsTodayOrInThePastAndTodayAsDay(
                  today,
                  item.fifthTestTimestamp,
                )
              ) {
                return true;
              }
            }
          }
          return false;
        },
      );
      const separateOrgList: any[] = [];
      organizationTypes.forEach((orgType) => {
        separateOrgList.push({
          ...orgType,
          filteredList: filterFirstTestDateAndOlder.filter(
            (item) => item.organizationTypeId === orgType.id,
          ),
        });
      });

      const chartDataOrganizations: ChartDataType = {
        labels: [t('common:Today')],
        datasets: separateOrgList.map((org, index) => {
          return {
            label: t(`common:${org.name}`),
            data: [org.filteredList.length],
            backgroundColor: getChartColorShade(index),
          };
        }),
      };

      const summedSeparatedOrgList: any[] = separateOrgList.map((org) => {
        const value: any = {
          id: org.id,
          name: org.name,
        };
        const filteredArray: ProgramMemberType[] = org.filteredList;
        if (org.id === organizationTypesEnum.School) {
          value.summedUpPeople = filteredArray.reduce<number>(
            (peopleCount, item) => {
              let divideBy = 1;
              if (item.secondTestTimestamp) {
                divideBy += 1;
              }
              if (item.thirdTestTimestamp) {
                divideBy += 1;
              }
              if (item.fourthTestTimestamp) {
                divideBy += 1;
              }
              if (item.fifthTestTimestamp) {
                divideBy += 1;
              }
              const numberOfSamples = item.numberOfSamples || 0;
              if (numberOfSamples > 0) {
                return peopleCount + Math.floor(numberOfSamples / divideBy);
              }
              return peopleCount;
            },
            0,
          );
        } else {
          value.summedUpPeople = filteredArray.reduce<number>(
            (peopleCount, item) => {
              let divideBy = 1;
              if (item.secondTestTimestamp) {
                divideBy += 1;
              }
              if (item.thirdTestTimestamp) {
                divideBy += 1;
              }
              if (item.fourthTestTimestamp) {
                divideBy += 1;
              }
              if (item.fifthTestTimestamp) {
                divideBy += 1;
              }
              const registeredEmployees = item.registeredEmployees || 0;
              if (registeredEmployees > 0) {
                return peopleCount + Math.floor(registeredEmployees / divideBy);
              }
              return peopleCount;
            },
            0,
          );
        }
        return value;
      });

      const chartDataPeople: ChartDataType = {
        labels: [t('common:Today')],
        datasets: summedSeparatedOrgList.map((org, index) => {
          return {
            label: t(`common:${org.name}`),
            data: [org.summedUpPeople],
            backgroundColor: getChartColorShade(index),
          };
        }),
      };

      dispatch(setOrganizationsBeingTestedData(chartDataOrganizations));
      dispatch(setPeopleBeingTestedData(chartDataPeople));
    }
  }
};

export const computeOverallTestingPieData = (t: TFunction): AppThunk => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const { programMembersRawData } = state.charts;
  const { organizationTypes } = state.organizationTypes;
  if (programMembersRawData.length !== 0) {
    const filterFirstTestDateAndOlder = programMembersRawData.filter((item) => {
      if (item.status === programMemberStatusEnum.NotActive) return false;
      if (item.firstTestTimestamp) {
        const firstTestingDate = parseISO(item.firstTestTimestamp);
        if (isToday(firstTestingDate)) {
          return true;
        }
        if (isPast(firstTestingDate)) {
          return true;
        }
      }
      return false;
    });

    const separateOrgList: any[] = [];
    organizationTypes.forEach((orgType) => {
      separateOrgList.push({
        ...orgType,
        filteredList: filterFirstTestDateAndOlder.filter(
          (item) => item.organizationTypeId === orgType.id,
        ),
      });
    });

    const chartDataOrganizations: ChartDataType = {
      labels: separateOrgList.map((org) => t(`common:${org.name}`)),
      datasets: [
        {
          label: 'Dataset 1',
          data: separateOrgList.map((org) => org.filteredList.length),
          backgroundColor: separateOrgList.map((org, index) =>
            getChartColorShade(index),
          ),
        },
      ],
    };

    const summedSeparatedOrgList: any[] = separateOrgList.map((org) => {
      const value: any = {
        id: org.id,
        name: org.name,
      };
      const filteredArray: ProgramMemberType[] = org.filteredList;
      if (org.id === organizationTypesEnum.School) {
        value.summedUpPeople = filteredArray.reduce<number>(
          (peopleCount, item) => (peopleCount += item.numberOfSamples || 0),
          0,
        );
      } else {
        value.summedUpPeople = filteredArray.reduce<number>(
          (peopleCount, item) => (peopleCount += item.registeredEmployees || 0),
          0,
        );
      }
      return value;
    });

    const chartDataPeople: ChartDataType = {
      labels: separateOrgList.map((org) => t(`common:${org.name}`)),
      datasets: [
        {
          label: 'Dataset 1',
          data: summedSeparatedOrgList.map((org) => org.summedUpPeople),
          backgroundColor: separateOrgList.map((org, index) =>
            getChartColorShade(index),
          ),
        },
      ],
    };

    dispatch(setOverallOrganizationsBeingTestedPieData(chartDataOrganizations));
    dispatch(setOverallPeopleBeingTestedPieData(chartDataPeople));
  }
};
