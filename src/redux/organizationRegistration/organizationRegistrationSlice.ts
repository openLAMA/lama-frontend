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
  RegisterOrganizationType,
  OrganizationRegistrationRequestType,
} from 'redux/organizationRegistration/types';
import { ErrorObjectType } from 'apiService/types';

import { organizationRegistrationAPI } from 'redux/organizationRegistration/organizationRegistrationApi';
interface IOrganizationRegistration {
  data: RegisterOrganizationType;
  registerStatus: IApiStatus;
}

const initialState = {
  registerStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  data: {
    name: '',
    typeId: -1,
    cityId: '',
    ZIP: '',
    contacts: [
      {
        email: '',
        name: '',
        phoneNumber: '',
        landLineNumber: '',
      },
    ],
    numberOfSamples: 0,
    numberOfPools: 0,
    address: '',
  },
} as IOrganizationRegistration;

const organizationRegistrationSlice = createSlice({
  name: 'organizationRegistration',
  initialState,
  reducers: {
    setOrganizationName(state, action: PayloadAction<string>) {
      state.data = initialState.data;
      state.data.name = action.payload;
    },
    setOrganizationData(
      state,
      action: PayloadAction<RegisterOrganizationType>,
    ) {
      state.data = action.payload;
    },
    resetOrganizationData(state) {
      state.data = initialState.data;
    },
    organizationRegistrationRequesting(state) {
      state.registerStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    organizationRegistrationSuccess(state) {
      state.registerStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    organizationRegistrationFailed(state) {
      state.registerStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
  },
});

export const {
  setOrganizationName,
  setOrganizationData,
  resetOrganizationData,
  organizationRegistrationRequesting,
  organizationRegistrationSuccess,
  organizationRegistrationFailed,
} = organizationRegistrationSlice.actions;

export default organizationRegistrationSlice.reducer;

export const registerOrganization = (
  data: OrganizationRegistrationRequestType,
): AppThunk => async (dispatch) => {
  dispatch(organizationRegistrationRequesting());
  organizationRegistrationAPI(data).then(
    (): void => {
      dispatch(organizationRegistrationSuccess());
    },
    (error: ErrorObjectType): void => {
      dispatch(organizationRegistrationFailed());
      extractErrorMessage(error, 'Failed to register organization!');
    },
  );
};
