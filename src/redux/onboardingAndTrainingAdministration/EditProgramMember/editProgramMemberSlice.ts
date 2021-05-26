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
import { IApiStatus, SupportPersonSelectType } from 'redux/globalTypes';
import { ProgramMemberType } from 'redux/globalState/programMembers/types';
import {
  GetProgramMemberRequestType,
  GetProgramMemberResponseType,
  GetSupportPeopleForOrganizationRequestType,
  GetSupportPeopleForOrganizationResponseType,
  PutSupportPeopleForOrganizationRequestType,
  DeactivateProgramMemberRequestType,
  PushToEpaadProgramMemberRequestType,
  PutFollowUpStatus,
} from 'redux/onboardingAndTrainingAdministration/EditProgramMember/types';
import { ErrorObjectType } from 'apiService/types';

import {
  getProgramMemberAPI,
  getSupportPeopleForOrganizationAPI,
  putSupportPeopleForOrganizationAPI,
  deactivateProgramMemberAPI,
  pushToEpaadProgramMemberAPI,
  putFollowUpStatusAPI,
} from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberApi';

interface IEditProgramMember {
  programMember: ProgramMemberType;
  programMemberStatus: IApiStatus;
  supportPeople: SupportPersonSelectType[];
  supportPeopleStatus: IApiStatus;
  updateProgramMemberStatus: IApiStatus;
  deactivateProgramMemberStatus: IApiStatus;
  pushToEpaadProgramMemberStatus: IApiStatus;
  updateFollowUpStatusStatus: IApiStatus;
}

const initialState = {
  programMember: {},
  programMemberStatus: {
    requesting: true,
    success: false,
    failure: false,
  },
  supportPeopleStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  updateProgramMemberStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  deactivateProgramMemberStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  pushToEpaadProgramMemberStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  updateFollowUpStatusStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as IEditProgramMember;

const editProgramMemberSlice = createSlice({
  name: 'editProgramMember',
  initialState,
  reducers: {
    getProgramMemberRequesting(state) {
      state.programMemberStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getProgramMemberSuccess(
      state,
      action: PayloadAction<GetProgramMemberResponseType>,
    ) {
      state.programMember = action.payload;
      state.programMemberStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getProgramMemberFailed(state) {
      state.programMemberStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    getSupportPeopleRequesting(state) {
      state.supportPeopleStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getSupportPeopleSuccess(
      state,
      action: PayloadAction<GetSupportPeopleForOrganizationResponseType>,
    ) {
      state.supportPeople = action.payload;
      state.supportPeopleStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getSupportPeopleFailed(state) {
      state.supportPeopleStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    updateProgramMemberRequesting(state) {
      state.updateProgramMemberStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    updateProgramMemberSuccess(state) {
      state.updateProgramMemberStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    updateProgramMemberFailed(state) {
      state.updateProgramMemberStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    deactivateProgramMemberRequesting(state) {
      state.deactivateProgramMemberStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    deactivateProgramMemberSuccess(state) {
      state.deactivateProgramMemberStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    deactivateProgramMemberFailed(state) {
      state.deactivateProgramMemberStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    pushToEpaadProgramMemberRequesting(state) {
      state.pushToEpaadProgramMemberStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    pushToEpaadProgramMemberSuccess(state) {
      state.pushToEpaadProgramMemberStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    pushToEpaadProgramMemberFailed(state) {
      state.pushToEpaadProgramMemberStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    updateFollowUpStatusRequesting(state) {
      state.updateFollowUpStatusStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    updateFollowUpStatusSuccess(state) {
      state.updateFollowUpStatusStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    updateFollowUpStatusFailed(state) {
      state.updateFollowUpStatusStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    clearUpdateProgramData(state) {
      state.programMember = initialState.programMember;
      state.programMemberStatus = initialState.programMemberStatus;
      state.supportPeople = initialState.supportPeople;
      state.supportPeopleStatus = initialState.supportPeopleStatus;
      state.updateProgramMemberStatus = initialState.updateProgramMemberStatus;
      state.deactivateProgramMemberStatus =
        initialState.deactivateProgramMemberStatus;
      state.pushToEpaadProgramMemberStatus =
        initialState.pushToEpaadProgramMemberStatus;
    },
  },
});

export const {
  getProgramMemberRequesting,
  getProgramMemberSuccess,
  getProgramMemberFailed,
  getSupportPeopleRequesting,
  getSupportPeopleSuccess,
  getSupportPeopleFailed,
  updateProgramMemberRequesting,
  updateProgramMemberSuccess,
  updateProgramMemberFailed,
  deactivateProgramMemberRequesting,
  deactivateProgramMemberSuccess,
  deactivateProgramMemberFailed,
  pushToEpaadProgramMemberRequesting,
  pushToEpaadProgramMemberSuccess,
  pushToEpaadProgramMemberFailed,
  updateFollowUpStatusRequesting,
  updateFollowUpStatusSuccess,
  updateFollowUpStatusFailed,
  clearUpdateProgramData,
} = editProgramMemberSlice.actions;

export default editProgramMemberSlice.reducer;

export const getProgramMember = (
  data: GetProgramMemberRequestType,
): AppThunk => async (dispatch) => {
  dispatch(getProgramMemberRequesting());
  getProgramMemberAPI(data).then(
    (response: GetProgramMemberResponseType): void => {
      dispatch(getProgramMemberSuccess(response));
    },
    (error): void => {
      dispatch(getProgramMemberFailed());
      extractErrorMessage(error, 'Failed to get program member data!');
    },
  );
};

export const getSupportPeople = (
  data: GetSupportPeopleForOrganizationRequestType,
): AppThunk => async (dispatch) => {
  dispatch(getSupportPeopleRequesting());
  getSupportPeopleForOrganizationAPI(data).then(
    (response: GetSupportPeopleForOrganizationResponseType): void => {
      dispatch(getSupportPeopleSuccess(response));
    },
    (error: ErrorObjectType): void => {
      dispatch(getSupportPeopleFailed());
      extractErrorMessage(error, 'Failed to get support people data!');
    },
  );
};

export const updateProgramMember = (
  data: PutSupportPeopleForOrganizationRequestType,
): AppThunk => async (dispatch) => {
  dispatch(updateProgramMemberRequesting());
  putSupportPeopleForOrganizationAPI(data).then(
    (): void => {
      dispatch(updateProgramMemberSuccess());
      callSnackbar({
        message: 'Successfully updated a program member!',

        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(updateProgramMemberFailed());
      extractErrorMessage(error, 'Failed to update program member!');
    },
  );
};

export const deactivateProgramMember = (
  data: DeactivateProgramMemberRequestType,
): AppThunk => async (dispatch) => {
  dispatch(deactivateProgramMemberRequesting());
  deactivateProgramMemberAPI(data).then(
    (): void => {
      dispatch(deactivateProgramMemberSuccess());
      callSnackbar({
        message: 'Successfully deactivated a program member!',

        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(deactivateProgramMemberFailed());
      extractErrorMessage(error, 'Failed to deactivate a program member!');
    },
  );
};

export const pushToEpaadProgramMember = (
  data: PushToEpaadProgramMemberRequestType,
): AppThunk => async (dispatch) => {
  dispatch(pushToEpaadProgramMemberRequesting());
  pushToEpaadProgramMemberAPI(data).then(
    (): void => {
      dispatch(pushToEpaadProgramMemberSuccess());
      callSnackbar({
        message: 'Successfully pushed program member data to Epaad!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(pushToEpaadProgramMemberFailed());
      extractErrorMessage(error, 'Failed to push program member to Epaad!');
    },
  );
};

export const updateFollowUpStatus = (
  data: PutFollowUpStatus,
): AppThunk => async (dispatch) => {
  dispatch(updateFollowUpStatusRequesting());
  putFollowUpStatusAPI(data).then(
    (): void => {
      dispatch(updateFollowUpStatusSuccess());
      callSnackbar({
        message: 'Successfully updated follow up status!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(updateFollowUpStatusFailed());
      extractErrorMessage(error, 'Failed to update follow up status!');
    },
  );
};
