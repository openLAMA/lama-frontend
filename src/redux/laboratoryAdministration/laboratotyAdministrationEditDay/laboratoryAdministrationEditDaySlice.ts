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
import { extractErrorMessage } from 'apiService/axiosInstance';

import callSnackbar from 'utils/customHooks/useSnackbar';

// Types
import { IApiStatus } from 'redux/globalTypes';
import { LaboratoryTestingPersonalResultType } from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/types';
import {
  GetLaboratoryAdministrationEditDayRequestType,
  GetLaboratoryAdministrationEditDayResponseType,
  RemoveLaboratoryAdministrationConfirmedPersonRequestType,
  GetLaboratoryAdministrationEmployeesResponseType,
  AddLaboratoryAdministrationEmployeeToShiftRequestType,
  IncreaseShiftCountForDayLaboratoryAdministrationRequestType,
} from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/types';
import { ErrorObjectType } from 'apiService/types';

import {
  getLaboratoryAdministrationEditDayDataAPI,
  removeLaboratoryAdministrationConfirmedEmployeeAPI,
  getLaboratoryAdministrationEmployeesAPI,
  addLaboratoryAdministrationEmployeeToShiftAPI,
  increaseShiftCountForDayLaboratoryAdministrationAPI,
} from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/laboratoryAdministrationEditDayApi';

interface ILaboratoryAdministrationEditDay {
  editDayData: GetLaboratoryAdministrationEditDayResponseType;
  getDayDataStatus: IApiStatus;
  removeConfirmedPersonStatus: IApiStatus;
  getEmployeesStatus: IApiStatus;
  addEmployeeToShiftStatus: IApiStatus;
  employees: LaboratoryTestingPersonalResultType[] | null;
  increaseShiftCountForDayStatus: IApiStatus;
}

const initialState = {
  editDayData: {},
  getDayDataStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  removeConfirmedPersonStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  getEmployeesStatus: {
    requesting: true,
    success: false,
    failure: false,
  },
  addEmployeeToShiftStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  increaseShiftCountForDayStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  employees: null,
} as ILaboratoryAdministrationEditDay;

const laboratoryAdministrationEditDaySlice = createSlice({
  name: 'laboratoryAdministrationEditDay',
  initialState,
  reducers: {
    getDayDataRequesting(state) {
      state.getDayDataStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getDayDataSuccess(
      state,
      action: PayloadAction<GetLaboratoryAdministrationEditDayResponseType>,
    ) {
      state.editDayData = action.payload;
      state.getDayDataStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getDayDataFailed(state) {
      state.getDayDataStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    removeConfirmedPersonRequesting(state) {
      state.removeConfirmedPersonStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    removeConfirmedPersonSuccess(state) {
      state.removeConfirmedPersonStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    removeConfirmedPersonFailed(state) {
      state.removeConfirmedPersonStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    getEmployeesRequesting(state) {
      state.getEmployeesStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getEmployeesSuccess(
      state,
      action: PayloadAction<GetLaboratoryAdministrationEmployeesResponseType>,
    ) {
      state.getEmployeesStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
      state.employees = action.payload.result;
    },
    getEmployeesFailed(state) {
      state.getEmployeesStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    addEmployeeToShiftRequesting(state) {
      state.addEmployeeToShiftStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    addEmployeeToShiftSuccess(state) {
      state.addEmployeeToShiftStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    addEmployeeToShiftFailed(state) {
      state.addEmployeeToShiftStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    increaseShiftCountForDayRequesting(state) {
      state.increaseShiftCountForDayStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    increaseShiftCountForDaySuccess(state) {
      state.increaseShiftCountForDayStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    increaseShiftCountForDayFailed(state) {
      state.increaseShiftCountForDayStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    clearAddEmployeeToShift(state) {
      state.addEmployeeToShiftStatus = initialState.addEmployeeToShiftStatus;
    },
    clearEmployees(state) {
      state.getEmployeesStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    clearDeleteLaboratoryTestingPerson(state) {
      state.removeConfirmedPersonStatus =
        initialState.removeConfirmedPersonStatus;
    },
    clearIncreaseShiftCountForDayStatus(state) {
      state.increaseShiftCountForDayStatus =
        initialState.increaseShiftCountForDayStatus;
    },
    clearEditDayData(state) {
      state.getDayDataStatus = initialState.getDayDataStatus;
      state.removeConfirmedPersonStatus =
        initialState.removeConfirmedPersonStatus;
    },
  },
});

export const {
  getDayDataRequesting,
  getDayDataSuccess,
  getDayDataFailed,
  removeConfirmedPersonRequesting,
  removeConfirmedPersonSuccess,
  removeConfirmedPersonFailed,
  getEmployeesRequesting,
  getEmployeesSuccess,
  getEmployeesFailed,
  addEmployeeToShiftRequesting,
  addEmployeeToShiftSuccess,
  addEmployeeToShiftFailed,
  clearAddEmployeeToShift,
  clearEmployees,
  clearDeleteLaboratoryTestingPerson,
  clearIncreaseShiftCountForDayStatus,
  clearEditDayData,
  increaseShiftCountForDayRequesting,
  increaseShiftCountForDaySuccess,
  increaseShiftCountForDayFailed,
} = laboratoryAdministrationEditDaySlice.actions;

export default laboratoryAdministrationEditDaySlice.reducer;

export const getLaboratoryAdministrationEditDayData = (
  params: GetLaboratoryAdministrationEditDayRequestType,
): AppThunk => async (dispatch) => {
  console.log(
    'getLaboratoryAdministrationEditDayData:',
    new Date().toTimeString(),
  );
  dispatch(getDayDataRequesting());
  getLaboratoryAdministrationEditDayDataAPI(params).then(
    (response: GetLaboratoryAdministrationEditDayResponseType): void => {
      dispatch(getDayDataSuccess(response));
    },
    (error: ErrorObjectType): void => {
      dispatch(getDayDataFailed());
      extractErrorMessage(error, 'Failed to get data for this day!');
    },
  );
};

export const removeConfirmedPerson = (
  data: RemoveLaboratoryAdministrationConfirmedPersonRequestType,
  isFixed?: boolean,
): AppThunk => async (dispatch) => {
  dispatch(removeConfirmedPersonRequesting());
  removeLaboratoryAdministrationConfirmedEmployeeAPI(data, isFixed).then(
    (): void => {
      dispatch(removeConfirmedPersonSuccess());
      callSnackbar({
        message: 'Successfully removed person from shift!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(removeConfirmedPersonFailed());
      extractErrorMessage(error, 'Failed to remove person!');
    },
  );
};

export const getLaboratoryAdministrationEmployees = (): AppThunk => async (
  dispatch,
) => {
  dispatch(getEmployeesRequesting());
  getLaboratoryAdministrationEmployeesAPI().then(
    (response: GetLaboratoryAdministrationEmployeesResponseType): void => {
      dispatch(getEmployeesSuccess(response));
    },
    (error: ErrorObjectType): void => {
      dispatch(getEmployeesFailed());
      extractErrorMessage(error, 'Failed to get employees');
    },
  );
};

export const addLaboratoryAdministrationEmployeeToShift = (
  data: AddLaboratoryAdministrationEmployeeToShiftRequestType,
): AppThunk => async (dispatch) => {
  dispatch(addEmployeeToShiftRequesting());
  addLaboratoryAdministrationEmployeeToShiftAPI(data).then(
    (): void => {
      dispatch(addEmployeeToShiftSuccess());
    },
    (error: ErrorObjectType): void => {
      dispatch(addEmployeeToShiftFailed());
      extractErrorMessage(error, 'Failed to add employee to shift');
    },
  );
};

export const increaseShiftCountForDayLaboratoryAdministrationShift = (
  data: IncreaseShiftCountForDayLaboratoryAdministrationRequestType,
): AppThunk => async (dispatch) => {
  dispatch(increaseShiftCountForDayRequesting());
  increaseShiftCountForDayLaboratoryAdministrationAPI(data).then(
    (): void => {
      dispatch(increaseShiftCountForDaySuccess());
    },
    (error: ErrorObjectType): void => {
      dispatch(increaseShiftCountForDayFailed());
      extractErrorMessage(error, 'Failed to increase shift count');
    },
  );
};
