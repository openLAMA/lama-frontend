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

// Types
import { IApiStatus } from 'redux/globalTypes';
import {
  CapacityOverviewType,
  GetCapacityOverviewResponseType,
  GetCapacityOverviewRequestType,
} from 'redux/globalState/capacity/types';
import { ErrorObjectType } from 'apiService/types';

import { getCapacityOverviewAPI } from 'redux/globalState/capacity/capacityApi';

interface ICapacityOverviewDashboard {
  capacityOverviewStatus: IApiStatus;
  capacityOverview: CapacityOverviewType[];
  isEarliestDate: boolean;
}

const initialState = {
  capacityOverviewStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  capacityOverview: [],
  isEarliestDate: false,
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
  },
});

export const {
  getCapacityOverviewRequesting,
  getCapacityOverviewSuccess,
  getCapacityOverviewFailed,
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
