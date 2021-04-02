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

import callSnackbar from 'utils/customHooks/useSnackbar';

import { IApiStatus } from 'redux/globalTypes';

import {
  GetLaboratoryTestingPersonalType,
  LaboratoryTestingPersonalStatusType,
  GetLaboratoryTestingPersonResponse,
  GetLaboratoryTestingPersonalStatusTypesListResponse,
  AddLaboratoryTestingPersonalRequestType,
  DeleteLaboratoryTestingPersonRequestType,
} from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/types';

import {
  getTestingPersonalAPI,
  getTestingPersonalStatusTypesListAPI,
  addTestingPersonalAPI,
  deleteTestingPersonalAPI,
} from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/organizationAdministrationTestingPersonalApi';

interface ILaboratoryTestingPersonal {
  testingPersonalsTableData: GetLaboratoryTestingPersonalType;
  getLaboratoryTestingPersonalStatus: IApiStatus;
  testingPersonalStatusTypes: LaboratoryTestingPersonalStatusType[];
  getLaboratoryTestingPersonStatusTypesListStatus: IApiStatus;
  addLaboratoryTestingPersonalStatus: IApiStatus;
  deleteLaboratoryTestingPersonStatus: IApiStatus;
}

const initialState = {
  testingPersonalsTableData: {
    currentPage: 1,
    pageSize: 20,
    totalPagesCount: 0,
    totalResultsCount: 0,
    result: [],
  },
  getLaboratoryTestingPersonalStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  testingPersonalStatusTypes: [],
  getLaboratoryTestingPersonStatusTypesListStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  addLaboratoryTestingPersonalStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  deleteLaboratoryTestingPersonStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as ILaboratoryTestingPersonal;

const laboratoryTestingPersonalSlice = createSlice({
  name: 'laboratoryTestingPersonal',
  initialState,
  reducers: {
    getLaboratoryTestingPersonalRequesting(state) {
      state.getLaboratoryTestingPersonalStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getLaboratoryTestingPersonalSuccess(
      state,
      action: PayloadAction<GetLaboratoryTestingPersonResponse>,
    ) {
      state.testingPersonalsTableData = action.payload;
      state.getLaboratoryTestingPersonalStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getLaboratoryTestingPersonalFailed(state) {
      state.getLaboratoryTestingPersonalStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    getLaboratoryTestingPersonalStatusTypesListRequesting(state) {
      state.getLaboratoryTestingPersonStatusTypesListStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getLaboratoryTestingPersonalStatusTypesListSuccess(
      state,
      action: PayloadAction<GetLaboratoryTestingPersonalStatusTypesListResponse>,
    ) {
      state.testingPersonalStatusTypes = action.payload;
      state.getLaboratoryTestingPersonStatusTypesListStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getLaboratoryTestingPersonalStatusTypesListFailed(state) {
      state.getLaboratoryTestingPersonStatusTypesListStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    addLaboratoryTestingPersonalRequesting(state) {
      state.addLaboratoryTestingPersonalStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    addLaboratoryTestingPersonalSuccess(state) {
      state.addLaboratoryTestingPersonalStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    addLaboratoryTestingPersonalFailed(state) {
      state.addLaboratoryTestingPersonalStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    deleteLaboratoryTestingPersonRequesting(state) {
      state.deleteLaboratoryTestingPersonStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    deleteLaboratoryTestingPersonSuccess(state) {
      state.deleteLaboratoryTestingPersonStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    deleteLaboratoryTestingPersonFailed(state) {
      state.deleteLaboratoryTestingPersonStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    clearLaboratoryTestingPersonFlags(state) {
      state.addLaboratoryTestingPersonalStatus = {
        requesting: false,
        success: false,
        failure: false,
      };
      state.deleteLaboratoryTestingPersonStatus = {
        requesting: false,
        success: false,
        failure: false,
      };
    },
  },
});

export const {
  getLaboratoryTestingPersonalRequesting,
  getLaboratoryTestingPersonalSuccess,
  getLaboratoryTestingPersonalFailed,
  getLaboratoryTestingPersonalStatusTypesListRequesting,
  getLaboratoryTestingPersonalStatusTypesListSuccess,
  getLaboratoryTestingPersonalStatusTypesListFailed,
  addLaboratoryTestingPersonalRequesting,
  addLaboratoryTestingPersonalSuccess,
  addLaboratoryTestingPersonalFailed,
  deleteLaboratoryTestingPersonRequesting,
  deleteLaboratoryTestingPersonSuccess,
  deleteLaboratoryTestingPersonFailed,
  clearLaboratoryTestingPersonFlags,
} = laboratoryTestingPersonalSlice.actions;

export default laboratoryTestingPersonalSlice.reducer;

export const getLaboratoryTestingPersonal = (): AppThunk => async (
  dispatch,
) => {
  dispatch(getLaboratoryTestingPersonalRequesting());
  getTestingPersonalAPI().then(
    (response: GetLaboratoryTestingPersonResponse): void => {
      dispatch(getLaboratoryTestingPersonalSuccess(response));
    },
    (error: any): void => {
      dispatch(getLaboratoryTestingPersonalFailed());
      callSnackbar({
        message: 'Failed to get laboratory testing data!',

        messageType: 'error',
      });
    },
  );
};

export const getTestingPersonalStatusTypesList = (): AppThunk => async (
  dispatch,
) => {
  dispatch(getLaboratoryTestingPersonalStatusTypesListRequesting());
  getTestingPersonalStatusTypesListAPI().then(
    (response: GetLaboratoryTestingPersonalStatusTypesListResponse): void => {
      dispatch(getLaboratoryTestingPersonalStatusTypesListSuccess(response));
    },
    (error: any): void => {
      dispatch(getLaboratoryTestingPersonalStatusTypesListFailed());
      callSnackbar({
        message: 'Failed to get testing personal statuses!',

        messageType: 'error',
      });
    },
  );
};

export const addLaboratoryTestingPerson = (
  data: AddLaboratoryTestingPersonalRequestType,
): AppThunk => async (dispatch) => {
  dispatch(addLaboratoryTestingPersonalRequesting());
  addTestingPersonalAPI(data).then(
    (): void => {
      dispatch(addLaboratoryTestingPersonalSuccess());
      callSnackbar({
        message: 'Successfully added a new testing person!',

        messageType: 'success',
      });
    },
    (error: any): void => {
      dispatch(addLaboratoryTestingPersonalFailed());
      callSnackbar({
        message: 'Failed to added a new testing person!',

        messageType: 'error',
      });
    },
  );
};

export const deleteLaboratoryTestingPerson = (
  id: DeleteLaboratoryTestingPersonRequestType,
): AppThunk => async (dispatch) => {
  dispatch(deleteLaboratoryTestingPersonRequesting());
  deleteTestingPersonalAPI(id).then(
    (): void => {
      dispatch(deleteLaboratoryTestingPersonSuccess());
      callSnackbar({
        message: 'Successfully remove testing person!',

        messageType: 'success',
      });
    },
    (error: any): void => {
      dispatch(deleteLaboratoryTestingPersonFailed());
      callSnackbar({
        message: 'Failed to delete testing personal!',

        messageType: 'error',
      });
    },
  );
};
