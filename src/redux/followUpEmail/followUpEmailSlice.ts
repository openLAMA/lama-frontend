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

import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from 'redux/store';
import { extractErrorMessage } from 'apiService/axiosInstance';

import callSnackbar from 'utils/customHooks/useSnackbar';

// Types
import { IApiStatus } from 'redux/globalTypes';
import { PostFollowUpEmailRequestType } from 'redux/followUpEmail/types';
import { ErrorObjectType } from 'apiService/types';

import { sendFollowUpEmailApi } from 'redux/followUpEmail/followUpEmailApi';

interface IFollowUpEmail {
  followUpEmailStatus: IApiStatus;
}

const initialState = {
  followUpEmailStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as IFollowUpEmail;

const followUpEmailSlice = createSlice({
  name: 'followUpEmail',
  initialState,
  reducers: {
    postFollowUpEmailRequesting(state) {
      state.followUpEmailStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    postFollowUpEmailSuccess(state) {
      state.followUpEmailStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    postFollowUpEmailFailed(state) {
      state.followUpEmailStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    resetFollowUpEmail(state) {
      state.followUpEmailStatus = initialState.followUpEmailStatus;
    },
  },
});

export const {
  postFollowUpEmailRequesting,
  postFollowUpEmailSuccess,
  postFollowUpEmailFailed,
  resetFollowUpEmail,
} = followUpEmailSlice.actions;

export default followUpEmailSlice.reducer;

export const postFollowUpEmail = (
  data: PostFollowUpEmailRequestType,
): AppThunk => async (dispatch) => {
  dispatch(postFollowUpEmailRequesting());
  sendFollowUpEmailApi(data).then(
    (): void => {
      dispatch(postFollowUpEmailSuccess());
      callSnackbar({
        message: 'Successfully sent follow up emails!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(postFollowUpEmailFailed());
      extractErrorMessage(error, 'Failed to send email to participants!');
    },
  );
};
