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
  CapacityOverviewType,
  GetCapacityOverviewResponseType,
} from 'redux/globalState/capacity/types';

import { getCapacityOverviewAPI } from 'redux/globalState/capacity/capacityApi';

interface ICapacityOverviewDashboard {
  capacityOverviewStatus: IApiStatus;
  capacityOverview: CapacityOverviewType[];
}

const initialState = {
  capacityOverviewStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  capacityOverview: [],
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
      state.capacityOverview = action.payload;
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

export const getCapacityOverview = (): AppThunk => async (dispatch) => {
  dispatch(getCapacityOverviewRequesting());
  getCapacityOverviewAPI().then(
    (response: GetCapacityOverviewResponseType): void => {
      dispatch(getCapacityOverviewSuccess(response));
    },
    (error): void => {
      dispatch(getCapacityOverviewFailed());
      callSnackbar({
        message: 'Failed to get capacity overview!',
        messageType: 'error',
      });
    },
  );
};
