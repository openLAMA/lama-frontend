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
  GetGeneralMyProfileType,
  MyProfileUserType,
  GetGeneralMyProfileResponseType,
  GetGeneralMyProfileRequestType,
  UpdateGeneralMyProfileRequestType,
} from 'redux/globalState/generalMyProfile/types';

import {
  getGeneralMyProfileAPI,
  updateGeneralMyProfileAPI,
} from 'redux/globalState/generalMyProfile/generalMyProfileApi';

type CustomGetGeneralMyProfileResponseType = {
  myPersonalData?: MyProfileUserType;
  myProfileData: GetGeneralMyProfileResponseType;
};

interface IGeneralMyProfile {
  getGeneralMyProfileStatus: IApiStatus;
  updateGeneralMyProfileStatus: IApiStatus;
  myPersonalData: MyProfileUserType;
  myProfileData: GetGeneralMyProfileType;
}

const initialState = {
  getGeneralMyProfileStatus: {
    requesting: true,
    success: false,
    failure: false,
  },
  updateGeneralMyProfileStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  myPersonalData: {},
  myProfileData: {},
} as IGeneralMyProfile;

const generalMyProfileSlice = createSlice({
  name: 'generalMyProfileSlice',
  initialState,
  reducers: {
    getGeneralMyProfileRequesting(state) {
      state.getGeneralMyProfileStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getGeneralMyProfileSuccess(
      state,
      action: PayloadAction<CustomGetGeneralMyProfileResponseType>,
    ) {
      if (action.payload.myPersonalData) {
        state.myPersonalData = action.payload.myPersonalData;
      }
      state.myProfileData = action.payload.myProfileData;
      state.getGeneralMyProfileStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getGeneralMyProfileError(state) {
      state.getGeneralMyProfileStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    updateGeneralMyProfileRequesting(state) {
      state.updateGeneralMyProfileStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    updateGeneralMyProfileSuccess(state) {
      state.updateGeneralMyProfileStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    updateGeneralMyProfileError(state) {
      state.updateGeneralMyProfileStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    resetMyProfileData(state) {
      state = initialState;
    },
  },
});

export const {
  getGeneralMyProfileRequesting,
  getGeneralMyProfileSuccess,
  getGeneralMyProfileError,
  updateGeneralMyProfileRequesting,
  updateGeneralMyProfileSuccess,
  updateGeneralMyProfileError,
  resetMyProfileData,
} = generalMyProfileSlice.actions;

export default generalMyProfileSlice.reducer;

export const getGeneralMyProfile = (
  data: GetGeneralMyProfileRequestType,
): AppThunk => async (dispatch, getState) => {
  dispatch(getGeneralMyProfileRequesting());
  const state = getState();
  getGeneralMyProfileAPI(data).then(
    (response: GetGeneralMyProfileResponseType): void => {
      const userId = state.authData.userId;
      let myPersonalData: MyProfileUserType | undefined;
      if (response.users.length !== 0) {
        myPersonalData = response.users.find((user) => user.id === userId);
      }
      const filteredContactPeople =
        response.users.filter((users) => users.id !== userId) || [];
      response.users = filteredContactPeople;
      dispatch(
        getGeneralMyProfileSuccess({
          myPersonalData: myPersonalData,
          myProfileData: response,
        }),
      );
    },
    (error): void => {
      dispatch(getGeneralMyProfileError());
      callSnackbar({
        message: 'Failed to fetch my profile details',
        messageType: 'error',
      });
    },
  );
};

export const updateMyGeneralProfile = (
  data: UpdateGeneralMyProfileRequestType,
): AppThunk => async (dispatch) => {
  dispatch(updateGeneralMyProfileRequesting());
  updateGeneralMyProfileAPI(data).then(
    (): void => {
      dispatch(updateGeneralMyProfileSuccess());
      callSnackbar({
        message: 'Successfully updated my profile details!',
        messageType: 'success',
      });
    },
    (error): void => {
      dispatch(updateGeneralMyProfileError());
      callSnackbar({
        message: 'Failed to update my profile details!',
        messageType: 'error',
      });
    },
  );
};
