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
import { ErrorObjectType } from 'apiService/types';
import { FollowUpEmailConfirmationRequestType } from 'redux/followUpEmailConfirmation/types';

import { checkFollowUpEmailConfirmationAPI } from 'redux/followUpEmailConfirmation/followUpEmailConfirmationApi';

interface IFollowUpEmailConfirmation {
  followUpEmailConfirmationStatus: IApiStatus;
  shiftsBooked: number[];
}

const initialState = {
  followUpEmailConfirmationStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  shiftsBooked: [],
} as IFollowUpEmailConfirmation;

const FollowUpEmailConfirmationSlice = createSlice({
  name: 'followUpEmailConfirmation',
  initialState,
  reducers: {
    followUpEmailConfirmationRequest(state) {
      state.followUpEmailConfirmationStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    followUpEmailConfirmationSuccess(state) {
      state.followUpEmailConfirmationStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    followUpEmailConfirmationFailed(state) {
      state.followUpEmailConfirmationStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
  },
});

export const {
  followUpEmailConfirmationRequest,
  followUpEmailConfirmationSuccess,
  followUpEmailConfirmationFailed,
} = FollowUpEmailConfirmationSlice.actions;

export default FollowUpEmailConfirmationSlice.reducer;

export const checkFollowUpEmailConfirmation = (
  data: FollowUpEmailConfirmationRequestType,
): AppThunk => async (dispatch) => {
  dispatch(followUpEmailConfirmationRequest());
  checkFollowUpEmailConfirmationAPI(data).then(
    (): void => {
      dispatch(followUpEmailConfirmationSuccess());
    },
    (error: ErrorObjectType): void => {
      dispatch(followUpEmailConfirmationFailed());
    },
  );
};
