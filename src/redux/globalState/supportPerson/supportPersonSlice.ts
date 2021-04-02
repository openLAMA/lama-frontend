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
import { SupportPersonType } from 'redux/globalTypes';

import callSnackbar from 'utils/customHooks/useSnackbar';

import { IApiStatus } from 'redux/globalTypes';

import {
  GetSupportPersonResponseType,
  GetSupportPersonRequestType,
} from 'redux/globalState/supportPerson/types';

import { getSupportPersonAPI } from 'redux/globalState/supportPerson/supportPersonApi';

interface ISupportPerson {
  supportPerson: SupportPersonType;
  supportPersonStatus: IApiStatus;
}

const initialState = {
  supportPerson: { name: '' },
  supportPersonStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as ISupportPerson;

const supportPersonSlice = createSlice({
  name: 'supportPerson',
  initialState,
  reducers: {
    setSupportPerson(state, action: PayloadAction<SupportPersonType>) {
      state.supportPerson = action.payload;
    },
    getSupportPersonRequest(state) {
      state.supportPersonStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getSupportPersonSuccess(
      state,
      action: PayloadAction<GetSupportPersonResponseType>,
    ) {
      state.supportPerson = action.payload;
      state.supportPersonStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getSupportPersonFailed(state) {
      state.supportPerson = {
        supportPersonId: '',
        name: 'Error',
      };
      state.supportPersonStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
  },
});

export const {
  setSupportPerson,
  getSupportPersonRequest,
  getSupportPersonSuccess,
  getSupportPersonFailed,
} = supportPersonSlice.actions;

export default supportPersonSlice.reducer;

export const getSupportPerson = (
  data: GetSupportPersonRequestType,
): AppThunk => async (dispatch) => {
  dispatch(getSupportPersonRequest());
  getSupportPersonAPI(data).then(
    (response: GetSupportPersonResponseType): void => {
      dispatch(getSupportPersonSuccess(response));
    },
    (error: any): void => {
      dispatch(getSupportPersonFailed());
      callSnackbar({
        message: 'Failed to fetch support person data!',
        messageType: 'error',
      });
    },
  );
};
