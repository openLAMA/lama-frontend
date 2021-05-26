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
import { ContactPersonType } from 'redux/globalTypes';
import { IApiStatus } from 'redux/globalTypes';
import {
  GetOrganizationType,
  GetOrganizationResponseType,
  GetOrganizationRequestType,
  UpdateOrganizationRequestType,
} from 'redux/organizationAdministration/organizationAdministrationMyProfile/types';
import { ErrorObjectType } from 'apiService/types';

import {
  getOrganizationAPI,
  updateOrganizationAPI,
} from 'redux/organizationAdministration/organizationAdministrationMyProfile/organizationAdministrationMyProfileApi';

type CustomGetOrganizationResponseType = {
  myPersonalData?: ContactPersonType;
  organizationType: GetOrganizationResponseType;
};

interface IOrganizationAdministration {
  getOrganizationStatus: IApiStatus;
  updateOrganizationStatus: IApiStatus;
  personalData: ContactPersonType;
  organizationData: GetOrganizationType;
}

const initialState = {
  getOrganizationStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  updateOrganizationStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  personalData: {
    name: '',
    email: '',
    phoneNumber: '',
    landLineNumber: '',
  },
  organizationData: {
    name: '',
    organizationTypeId: -1,
    cityId: '',
    ZIP: '',
    contacts: [
      {
        email: '',
        name: '',
        phoneNumber: '',
      },
    ],
    numberOfSamples: 0,
    numberOfPools: 0,
    address: '',
    status: '',
    supportPersonId: '',
  },
} as IOrganizationAdministration;

const organizationMyProfileSlice = createSlice({
  name: 'organizationMyProfile',
  initialState,
  reducers: {
    getOrganizationRequesting(state) {
      state.getOrganizationStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getOrganizationSuccess(
      state,
      action: PayloadAction<CustomGetOrganizationResponseType>,
    ) {
      if (action.payload.myPersonalData) {
        state.personalData = action.payload.myPersonalData;
      }
      state.organizationData = action.payload.organizationType;
      state.getOrganizationStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getOrganizationError(state) {
      state.getOrganizationStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    updateOrganizationRequesting(state) {
      state.updateOrganizationStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    updateOrganizationSuccess(state) {
      state.updateOrganizationStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    updateOrganizationError(state) {
      state.updateOrganizationStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    setMyPersonalData(state, action: PayloadAction<ContactPersonType>) {
      state.personalData = action.payload;
    },
    setMyOrganizationData(state, action: PayloadAction<GetOrganizationType>) {
      state.organizationData = action.payload;
    },
    resetMyProfileData(state) {
      state = initialState;
    },
  },
});

export const {
  getOrganizationRequesting,
  getOrganizationSuccess,
  getOrganizationError,
  updateOrganizationRequesting,
  updateOrganizationSuccess,
  updateOrganizationError,
  setMyPersonalData,
  setMyOrganizationData,
  resetMyProfileData,
} = organizationMyProfileSlice.actions;

export default organizationMyProfileSlice.reducer;

export const getMyProfileOrganization = (
  data: GetOrganizationRequestType,
): AppThunk => async (dispatch, getState) => {
  dispatch(getOrganizationRequesting());
  const state = getState();

  getOrganizationAPI(data).then(
    (response: GetOrganizationResponseType): void => {
      const userId = state.authData.userId;
      let myPersonalData: ContactPersonType | undefined;
      if (response.contacts.length !== 0) {
        myPersonalData = response.contacts.find(
          (person) => person.id === userId,
        );
      }
      const filteredContactPeople =
        response.contacts.filter((person) => person.id !== userId) || [];
      response.contacts = filteredContactPeople;
      dispatch(
        getOrganizationSuccess({
          myPersonalData: myPersonalData,
          organizationType: response,
        }),
      );
    },
    (error: ErrorObjectType): void => {
      dispatch(getOrganizationError());
      extractErrorMessage(error, 'Failed to fetch organization details!');
    },
  );
};

export const updateMyOrganization = (
  data: UpdateOrganizationRequestType,
): AppThunk => async (dispatch) => {
  dispatch(updateOrganizationRequesting());
  updateOrganizationAPI(data).then(
    (): void => {
      dispatch(updateOrganizationSuccess());
      callSnackbar({
        message: 'Successfully updated organization details!',

        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(updateOrganizationError());
      extractErrorMessage(error, 'Failed to update organization details!');
    },
  );
};
