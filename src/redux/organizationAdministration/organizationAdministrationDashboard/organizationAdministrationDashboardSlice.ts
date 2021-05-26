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
import {
  OrganizationDashboardInfo,
  GetOrganizationDashboardResponseType,
  GetOrganizationDashboardInfoRequestType,
} from 'redux/organizationAdministration/organizationAdministrationDashboard/types';
import { ErrorObjectType } from 'apiService/types';

// Outer Actions
import { setSupportPerson } from 'redux/globalState/supportPerson/supportPersonSlice';

import { getOrganizationAPI } from 'redux/organizationAdministration/organizationAdministrationDashboard/organizationAdministrationDashboardApi';

interface IOrganizationAdministrationDashboard {
  getOrganizationDashboardStatus: IApiStatus;
  dashboardInfo: OrganizationDashboardInfo;
}

const initialState = {
  getOrganizationDashboardStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  dashboardInfo: {},
} as IOrganizationAdministrationDashboard;

const organizationDashboardSlice = createSlice({
  name: 'organizationDashboard',
  initialState,
  reducers: {
    getOrganizationDashboardRequesting(state) {
      state.getOrganizationDashboardStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getOrganizationDashboardSuccess(
      state,
      action: PayloadAction<GetOrganizationDashboardResponseType>,
    ) {
      state.dashboardInfo = action.payload;
      state.getOrganizationDashboardStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getOrganizationDashboardError(state) {
      state.getOrganizationDashboardStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
  },
});

export const {
  getOrganizationDashboardRequesting,
  getOrganizationDashboardSuccess,
  getOrganizationDashboardError,
} = organizationDashboardSlice.actions;

export default organizationDashboardSlice.reducer;

export const getOrganizationDashboardInfo = (
  data: GetOrganizationDashboardInfoRequestType,
): AppThunk => async (dispatch) => {
  dispatch(getOrganizationDashboardRequesting());

  getOrganizationAPI(data).then(
    (response: GetOrganizationDashboardResponseType): void => {
      dispatch(getOrganizationDashboardSuccess(response));
      dispatch(setSupportPerson(response.supportPerson));
    },
    (error: ErrorObjectType): void => {
      dispatch(getOrganizationDashboardError());
      extractErrorMessage(error, 'Failed to get dashboard info!');
    },
  );
};
