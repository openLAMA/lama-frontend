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
  ReActivateProgramMemberRequestType,
  PushToEpaadProgramMemberRequestType,
  PutFollowUpStatus,
  UpdateStaticPoolingRequestType,
  CampSendEmailEpaadRequestType,
} from 'redux/onboardingAndTrainingAdministration/EditProgramMember/types';
import { ErrorObjectType } from 'apiService/types';

import {
  getProgramMemberAPI,
  getSupportPeopleForOrganizationAPI,
  putSupportPeopleForOrganizationAPI,
  deactivateProgramMemberAPI,
  reActivateProgramMemberAPI,
  pushToEpaadProgramMemberAPI,
  putFollowUpStatusAPI,
  updateStaticPoolingStatusAPI,
  campSendEmailEpaadAPI,
} from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberApi';

interface IEditProgramMember {
  programMember: ProgramMemberType;
  programMemberStatus: IApiStatus;
  supportPeople: SupportPersonSelectType[];
  supportPeopleStatus: IApiStatus;
  updateProgramMemberStatus: IApiStatus;
  deactivateProgramMemberStatus: IApiStatus;
  reActivateProgramMemberStatus: IApiStatus;
  pushToEpaadProgramMemberStatus: IApiStatus;
  updateFollowUpStatusStatus: IApiStatus;
  updateStaticPoolingStatus: IApiStatus;
  campSendEmailEpaadStatus: IApiStatus;
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
  reActivateProgramMemberStatus: {
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
  updateStaticPoolingStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  campSendEmailEpaadStatus: {
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
    reActivateProgramMemberRequesting(state) {
      state.reActivateProgramMemberStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    reActivateProgramMemberSuccess(state) {
      state.reActivateProgramMemberStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    reActivateProgramMemberFailed(state) {
      state.reActivateProgramMemberStatus = {
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
    updateStaticPoolingStatusRequesting(state) {
      state.updateStaticPoolingStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    updateStaticPoolingStatusSuccess(state, action: PayloadAction<boolean>) {
      state.updateStaticPoolingStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
      state.programMember.isStaticPooling = action.payload;
    },
    updateStaticPoolingStatusFailed(state) {
      state.updateStaticPoolingStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    campSendEmailEpaadRequesting(state) {
      state.campSendEmailEpaadStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    campSendEmailEpaadSuccess(state) {
      state.campSendEmailEpaadStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    campSendEmailEpaadFailed(state) {
      state.campSendEmailEpaadStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    clearCampSendEmailEpaadStats(state) {
      state.campSendEmailEpaadStatus = initialState.campSendEmailEpaadStatus;
    },
    clearUpdateProgramData(state) {
      state.programMember = initialState.programMember;
      state.programMemberStatus = initialState.programMemberStatus;
      state.supportPeople = initialState.supportPeople;
      state.supportPeopleStatus = initialState.supportPeopleStatus;
      state.updateProgramMemberStatus = initialState.updateProgramMemberStatus;
      state.campSendEmailEpaadStatus = initialState.campSendEmailEpaadStatus;
      state.deactivateProgramMemberStatus =
        initialState.deactivateProgramMemberStatus;
      state.reActivateProgramMemberStatus =
        initialState.reActivateProgramMemberStatus;
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
  reActivateProgramMemberRequesting,
  reActivateProgramMemberSuccess,
  reActivateProgramMemberFailed,
  pushToEpaadProgramMemberRequesting,
  pushToEpaadProgramMemberSuccess,
  pushToEpaadProgramMemberFailed,
  updateFollowUpStatusRequesting,
  updateFollowUpStatusSuccess,
  updateFollowUpStatusFailed,
  updateStaticPoolingStatusRequesting,
  updateStaticPoolingStatusSuccess,
  updateStaticPoolingStatusFailed,
  campSendEmailEpaadRequesting,
  campSendEmailEpaadSuccess,
  campSendEmailEpaadFailed,
  clearCampSendEmailEpaadStats,
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

export const reActivateProgramMember = (
  data: ReActivateProgramMemberRequestType,
): AppThunk => async (dispatch) => {
  dispatch(reActivateProgramMemberRequesting());
  reActivateProgramMemberAPI(data).then(
    (): void => {
      dispatch(reActivateProgramMemberSuccess());
      callSnackbar({
        message: 'Successfully re-activated a program member!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(reActivateProgramMemberFailed());
      extractErrorMessage(error, 'Failed to re-activate a program member!');
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

export const updateStaticPoolingStatus = (
  data: UpdateStaticPoolingRequestType,
): AppThunk => async (dispatch) => {
  dispatch(updateStaticPoolingStatusRequesting());
  updateStaticPoolingStatusAPI(data).then(
    (): void => {
      dispatch(updateStaticPoolingStatusSuccess(data.isStaticPooling));
      callSnackbar({
        message: 'Successfully updated static pooling status!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(updateStaticPoolingStatusFailed());
      extractErrorMessage(error, 'Failed to update static pooling status!');
    },
  );
};

export const campSendEmailEpaad = (
  data: CampSendEmailEpaadRequestType,
): AppThunk => async (dispatch) => {
  dispatch(campSendEmailEpaadRequesting());
  campSendEmailEpaadAPI(data).then(
    (): void => {
      dispatch(campSendEmailEpaadSuccess());
      callSnackbar({
        message: 'Successfully sent email!',
        messageType: 'success',
      });
    },
    (error: ErrorObjectType): void => {
      dispatch(campSendEmailEpaadFailed());
      extractErrorMessage(error, 'Failed to send email!');
    },
  );
};
