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
import { OrganizationTypeType } from 'redux/globalTypes';
import { GetOrganizationTypesResponseType } from 'redux/globalState/organizationTypes/types';
import { ErrorObjectType } from 'apiService/types';

import { getOrganizationTypesAPI } from 'redux/globalState/organizationTypes/organizationTypesApi';

interface IOrganizationTypes {
  organizationTypes: OrganizationTypeType[];
  organizationTypesStatus: IApiStatus;
}

const initialState = {
  organizationTypes: [],
  organizationTypesStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as IOrganizationTypes;

const organizationTypesSlice = createSlice({
  name: 'organizationTypes',
  initialState,
  reducers: {
    getOrganizationTypesRequest(state) {
      state.organizationTypesStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getOrganizationTypesSuccess(
      state,
      action: PayloadAction<GetOrganizationTypesResponseType>,
    ) {
      state.organizationTypes = action.payload || [];
      state.organizationTypesStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getOrganizationTypesFailed(state) {
      state.organizationTypesStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
  },
});

export const {
  getOrganizationTypesRequest,
  getOrganizationTypesSuccess,
  getOrganizationTypesFailed,
} = organizationTypesSlice.actions;

export default organizationTypesSlice.reducer;

export const getOrganizationTypes = (): AppThunk => async (dispatch) => {
  dispatch(getOrganizationTypesRequest());
  getOrganizationTypesAPI().then(
    (response: GetOrganizationTypesResponseType): void => {
      dispatch(getOrganizationTypesSuccess(response));
    },
    (error: ErrorObjectType): void => {
      dispatch(getOrganizationTypesFailed());
      extractErrorMessage(error, 'Failed to fetch organization types list!');
    },
  );
};
