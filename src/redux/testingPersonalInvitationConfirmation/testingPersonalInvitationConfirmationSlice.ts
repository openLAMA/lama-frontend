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
import {
  TestingPersonalInvitationConfirmationRequestType,
  TestingPersonalInvitationConfirmationResponseType,
} from 'redux/testingPersonalInvitationConfirmation/types';

import { checkTestingPersonalInvitationConfirmationAPI } from 'redux/testingPersonalInvitationConfirmation/testingPersonalInvitationConfirmationApi';

interface ITestingPersonalInvitationConfirmation {
  testingPersonalInvitationConfirmationStatus: IApiStatus;
  shiftsBooked: number[];
}

const initialState = {
  testingPersonalInvitationConfirmationStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  shiftsBooked: [],
} as ITestingPersonalInvitationConfirmation;

const testingPersonalInvitationConfirmationSlice = createSlice({
  name: 'testingPersonalInvitationConfirmation',
  initialState,
  reducers: {
    testingPersonalInvitationConfirmationRequest(state) {
      state.testingPersonalInvitationConfirmationStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    testingPersonalInvitationConfirmationSuccess(
      state,
      action: PayloadAction<TestingPersonalInvitationConfirmationResponseType>,
    ) {
      state.shiftsBooked = action.payload.shiftsBooked;
      state.testingPersonalInvitationConfirmationStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    testingPersonalInvitationConfirmationFailed(state) {
      state.testingPersonalInvitationConfirmationStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    setResponseIsEmpty(state) {
      state.testingPersonalInvitationConfirmationStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
  },
});

export const {
  testingPersonalInvitationConfirmationRequest,
  testingPersonalInvitationConfirmationSuccess,
  testingPersonalInvitationConfirmationFailed,
  setResponseIsEmpty,
} = testingPersonalInvitationConfirmationSlice.actions;

export default testingPersonalInvitationConfirmationSlice.reducer;

export const checkTestingPersonalInvitationConfirmation = (
  data: TestingPersonalInvitationConfirmationRequestType,
): AppThunk => async (dispatch) => {
  dispatch(testingPersonalInvitationConfirmationRequest());
  checkTestingPersonalInvitationConfirmationAPI(data).then(
    (response: TestingPersonalInvitationConfirmationResponseType): void => {
      if (response) {
        dispatch(testingPersonalInvitationConfirmationSuccess(response));
      } else {
        dispatch(setResponseIsEmpty());
      }
    },
    (error: ErrorObjectType): void => {
      dispatch(testingPersonalInvitationConfirmationFailed());
      extractErrorMessage(error, 'Failed to get program member data!');
    },
  );
};
