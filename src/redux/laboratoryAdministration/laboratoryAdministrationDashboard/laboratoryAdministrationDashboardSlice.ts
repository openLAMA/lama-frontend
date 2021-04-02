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
import callSnackbar from 'utils/customHooks/useSnackbar';

import { IApiStatus } from 'redux/globalTypes';

import {
  InviteLaboratoryCapacityStudentsRequestType,
  InviteLaboratoryCapacityStudentsResponseType,
} from 'redux/laboratoryAdministration/laboratoryAdministrationDashboard/types';

import { inviteLaboratoryCapacityStudentsAPI } from 'redux/laboratoryAdministration/laboratoryAdministrationDashboard/laboratoryAdministrationDashboardApi';

interface ILaboratoryCapacityOverviewDashboard {
  inviteLaboratoryCapacityStudentsStatus: IApiStatus;
}

const initialState = {
  inviteLaboratoryCapacityStudentsStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as ILaboratoryCapacityOverviewDashboard;

const laboratoryDashboardSlice = createSlice({
  name: 'laboratoryDashboard',
  initialState,
  reducers: {
    inviteLaboratoryCapacityStudentsRequesting(state) {
      state.inviteLaboratoryCapacityStudentsStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    inviteLaboratoryCapacityStudentsSuccess(state) {
      state.inviteLaboratoryCapacityStudentsStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    inviteLaboratoryCapacityStudentsFailed(state) {
      state.inviteLaboratoryCapacityStudentsStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
  },
});

export const {
  inviteLaboratoryCapacityStudentsRequesting,
  inviteLaboratoryCapacityStudentsSuccess,
  inviteLaboratoryCapacityStudentsFailed,
} = laboratoryDashboardSlice.actions;

export default laboratoryDashboardSlice.reducer;

export const inviteLaboratoryCapacityStudents = (
  data: InviteLaboratoryCapacityStudentsRequestType,
): AppThunk => async (dispatch) => {
  dispatch(inviteLaboratoryCapacityStudentsRequesting());
  inviteLaboratoryCapacityStudentsAPI(data).then(
    (response: InviteLaboratoryCapacityStudentsResponseType): void => {
      dispatch(inviteLaboratoryCapacityStudentsSuccess());
      callSnackbar({
        message: 'APISuccessMessages:Successfully sent invitation!',
        messageType: 'success',
      });
    },
    (error: any): void => {
      dispatch(inviteLaboratoryCapacityStudentsFailed());
      callSnackbar({
        message: 'APIErrorMessages:Failed to send invite!',
        messageType: 'error',
      });
    },
  );
};
