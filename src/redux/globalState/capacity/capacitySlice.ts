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
import {
  CapacityOverviewType,
  GetCapacityOverviewResponseType,
  GetCapacityOverviewRequestType,
  AddStateRequestType,
  GetStateResponseType,
  UpdateStateRequestType,
  RemoveStateRequestType,
  GetStateRequestType,
} from 'redux/globalState/capacity/types';
import { ErrorObjectType } from 'apiService/types';

import {
  getCapacityOverviewAPI,
  addStateAPI,
  getStateAPI,
  updateStateAPI,
  removeStateAPI,
} from 'redux/globalState/capacity/capacityApi';

interface ICapacityOverviewDashboard {
  capacityOverviewStatus: IApiStatus;
  capacityOverview: CapacityOverviewType[];
  isEarliestDate: boolean;
  addStateStatus: IApiStatus;
  getStateStatus: IApiStatus;
  editStateData: GetStateResponseType | null;
  updateStateStatus: IApiStatus;
  removeStateStatus: IApiStatus;
}

const initialState = {
  capacityOverviewStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  capacityOverview: [],
  isEarliestDate: false,
  addStateStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  getStateStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  editStateData: null,
  updateStateStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  removeStateStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as ICapacityOverviewDashboard;

const capacitySlice = createSlice({
  name: 'capacity',
  initialState,
  reducers: {
    getCapacityOverviewRequesting(state) {
      state.capacityOverviewStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getCapacityOverviewSuccess(
      state,
      action: PayloadAction<GetCapacityOverviewResponseType>,
    ) {
      state.capacityOverview = action.payload.testsData || [];
      state.isEarliestDate = action.payload.isEarliestDate || false;
      state.capacityOverviewStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getCapacityOverviewFailed(state) {
      state.capacityOverviewStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    addStateRequesting(state) {
      state.addStateStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    addStateSuccess(state) {
      state.addStateStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    addStateFailed(state) {
      state.addStateStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    clearAddStateFlags(state) {
      state.addStateStatus = {
        requesting: false,
        success: false,
        failure: false,
      };
    },
    getStateRequesting(state) {
      state.getStateStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getStateSuccess(state, action: PayloadAction<GetStateResponseType>) {
      state.getStateStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
      state.editStateData = action.payload;
    },
    getStateFailed(state) {
      state.getStateStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    clearGetStateFlags(state) {
      state.getStateStatus = {
        requesting: false,
        success: false,
        failure: false,
      };
      state.editStateData = null;
    },
    removeStateRequesting(state) {
      state.removeStateStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    removeStateSuccess(state) {
      state.removeStateStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    removeStateFailed(state) {
      state.removeStateStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    clearRemoveStateFlags(state) {
      state.removeStateStatus = {
        requesting: false,
        success: false,
        failure: false,
      };
    },
    updateStateRequesting(state) {
      state.updateStateStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    updateStateSuccess(state) {
      state.updateStateStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    updateStateFailed(state) {
      state.updateStateStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    clearUpdateStateFlags(state) {
      state.updateStateStatus = {
        requesting: false,
        success: false,
        failure: false,
      };
    },
  },
});

export const {
  getCapacityOverviewRequesting,
  getCapacityOverviewSuccess,
  getCapacityOverviewFailed,
  addStateRequesting,
  addStateSuccess,
  addStateFailed,
  clearAddStateFlags,
  getStateRequesting,
  getStateSuccess,
  getStateFailed,
  clearGetStateFlags,
  removeStateRequesting,
  removeStateSuccess,
  removeStateFailed,
  clearRemoveStateFlags,
  updateStateRequesting,
  updateStateSuccess,
  updateStateFailed,
  clearUpdateStateFlags,
} = capacitySlice.actions;

export default capacitySlice.reducer;

export const getCapacityOverview = (
  params?: GetCapacityOverviewRequestType,
): AppThunk => async (dispatch) => {
  dispatch(getCapacityOverviewRequesting());
  getCapacityOverviewAPI(params).then(
    (response: GetCapacityOverviewResponseType): void => {
      dispatch(getCapacityOverviewSuccess(response));
    },
    (error: ErrorObjectType): void => {
      dispatch(getCapacityOverviewFailed());
      extractErrorMessage(error, 'Failed to get capacity overview!');
    },
  );
};

export const addState = (data: AddStateRequestType): AppThunk => async (
  dispatch,
) => {
  dispatch(addStateRequesting());
  addStateAPI(data).then(
    (): void => {
      dispatch(addStateSuccess());
      callSnackbar({
        message: 'Successfully added new state!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(addStateFailed());
      extractErrorMessage(error, 'Failed to add new state!');
    },
  );
};

export const getState = (params: GetStateRequestType): AppThunk => async (
  dispatch,
) => {
  dispatch(getStateRequesting());
  getStateAPI(params).then(
    (response: GetStateResponseType): void => {
      dispatch(getStateSuccess(response));
    },
    (error: ErrorObjectType): void => {
      dispatch(getStateFailed());
      extractErrorMessage(error, 'Failed to get state!');
    },
  );
};

export const updateState = (data: UpdateStateRequestType): AppThunk => async (
  dispatch,
) => {
  dispatch(updateStateRequesting());
  updateStateAPI(data).then(
    (): void => {
      dispatch(updateStateSuccess());
      callSnackbar({
        message: 'Successfully updated state!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(updateStateFailed());
      extractErrorMessage(error, 'Failed to update state!');
    },
  );
};

export const removeState = (data: RemoveStateRequestType): AppThunk => async (
  dispatch,
) => {
  dispatch(removeStateRequesting());
  removeStateAPI(data).then(
    (): void => {
      dispatch(removeStateSuccess());
      callSnackbar({
        message: 'Successfully removed state!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(removeStateFailed());
      extractErrorMessage(error, 'Failed to remove state!');
    },
  );
};
