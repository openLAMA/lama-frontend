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
import jwt_decode from 'jwt-decode';

import { ConfirmLoginResponseType } from 'redux/auth/types';

import { RoleType } from 'redux/globalTypes';

import { UserDataType } from 'redux/authData/types';

interface IAuthData {
  token: string;
  organizationId: string;
  userId: string;
  roleType: RoleType;
  signedOut: boolean;
  userData: UserDataType | null;
}

const initialState = {
  token: '',
  organizationId: '',
  userId: '',
  roleType: '',
  signedOut: false,
  userData: null,
} as IAuthData;

const authDataSlice = createSlice({
  name: 'authData',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<ConfirmLoginResponseType>) {
      const decodedJWT: any = jwt_decode(action.payload.token);
      state.roleType =
        decodedJWT[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];
      state.organizationId = decodedJWT.OrgOrCompanyId;
      state.token = action.payload.token;
      state.userId = decodedJWT.jti;
      state.signedOut = false;
      const convertToUserData: UserDataType = {
        id: '',
        name: action.payload.userName,
        email: action.payload.email,
        phoneNumber: '',
      };
      state.userData = convertToUserData;
    },
    clearAuthData(state) {
      state.userId = '';
      state.roleType = '';
      state.token = '';
      state.signedOut = true;
    },
  },
});

export const { setAuthData, clearAuthData } = authDataSlice.actions;

export default authDataSlice.reducer;
