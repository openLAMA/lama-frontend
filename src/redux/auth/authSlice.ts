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

// Types
import { IApiStatus } from 'redux/globalTypes';
import { ErrorObjectType } from 'apiService/types';

import { loginAPI, confirmLoginAPI, confirmRegistrationAPI } from './authAPI';

import {
  LoginRequestType,
  LoginResponseType,
  ConfirmLoginRequestType,
  ConfirmLoginResponseType,
  ConfirmRegistrationRequestType,
  ConfirmRegistrationResponseType,
} from 'redux/auth/types';

// Outer slices
import { setAuthData } from 'redux/authData/authDataSlice';

export interface AuthState {
  loginRequestStatus: IApiStatus;
  confirmLoginStatus: IApiStatus;
  confirmRegistrationStatus: IApiStatus;
}

const initialState = {
  loginRequestStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  confirmLoginStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  confirmRegistrationStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as AuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loginRequestStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    loginSuccess(state) {
      state.loginRequestStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    loginFailed(state) {
      state.loginRequestStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    confirmLoginRequest(state) {
      state.confirmLoginStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    confirmLoginSuccess(state) {
      state.confirmLoginStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    confirmLoginFailed(state) {
      state.confirmLoginStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    confirmRegistrationRequest(state) {
      state.confirmRegistrationStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    confirmRegistrationSuccess(state) {
      state.confirmRegistrationStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    confirmRegistrationFailed(state) {
      state.confirmRegistrationStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    resetAuth(state) {
      state.loginRequestStatus.requesting = false;
    },
    clearLoginFlags(state) {
      state.loginRequestStatus = {
        requesting: false,
        success: false,
        failure: false,
      };
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailed,
  confirmLoginRequest,
  confirmLoginSuccess,
  confirmLoginFailed,
  confirmRegistrationRequest,
  confirmRegistrationSuccess,
  confirmRegistrationFailed,
  resetAuth,
  clearLoginFlags,
} = authSlice.actions;

export default authSlice.reducer;

export const login = (data: LoginRequestType): AppThunk => async (dispatch) => {
  dispatch(loginRequest());
  loginAPI(data).then(
    (response: LoginResponseType): void => {
      dispatch(loginSuccess());
    },
    (error: ErrorObjectType): void => {
      dispatch(loginFailed());
      extractErrorMessage(error, 'Failed to send email!');
    },
  );
};

export const confirmLogin = (data: ConfirmLoginRequestType): AppThunk => async (
  dispatch,
) => {
  dispatch(confirmLoginRequest());

  confirmLoginAPI(data).then(
    (response: ConfirmLoginResponseType): void => {
      dispatch(setAuthData(response));
      dispatch(confirmLoginSuccess());
    },
    (error: ErrorObjectType): void => {
      dispatch(confirmLoginFailed());
    },
  );
};

export const confirmRegistration = (
  data: ConfirmRegistrationRequestType,
): AppThunk => async (dispatch) => {
  dispatch(confirmRegistrationRequest());
  confirmRegistrationAPI(data).then(
    (response: ConfirmRegistrationResponseType): void => {
      dispatch(setAuthData(response));
      dispatch(confirmRegistrationSuccess());
    },
    (error: ErrorObjectType): void => {
      dispatch(confirmRegistrationFailed());
    },
  );
};
