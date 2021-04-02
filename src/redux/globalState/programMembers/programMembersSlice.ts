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
  GetProgramMembersType,
  ProgramMemberFilterType,
  GetProgramMembersRequestType,
  GetProgramMembersResponseType,
} from 'redux/globalState/programMembers/types';

import { getProgramMembersAPI } from 'redux/globalState/programMembers/programMembersApi';

interface IProgramMembersPersonal {
  programMembersStatus: IApiStatus;
  programMembers: GetProgramMembersType;
  filter: ProgramMemberFilterType;
}

const initialState = {
  programMembersStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  programMembers: {
    currentPage: 1,
    pageSize: 20,
    totalPagesCount: 0,
    totalResultsCount: 0,
    result: [],
  },
  filter: {
    order: 'desc',
    orderBy: '',
    filterType: -1,
    filterStatus: 'All',
    filterEpaadStatusPending: false,
  },
} as IProgramMembersPersonal;

const programMembersSlice = createSlice({
  name: 'programMembers',
  initialState,
  reducers: {
    programMembersRequesting(state) {
      state.programMembersStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    programMembersSuccess(
      state,
      action: PayloadAction<GetProgramMembersResponseType>,
    ) {
      state.programMembersStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
      state.programMembers = action.payload;
    },
    programMembersFailed(state) {
      state.programMembersStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    setFilter(state, action: PayloadAction<ProgramMemberFilterType>) {
      state.filter = action.payload;
    },
  },
});

export const {
  programMembersRequesting,
  programMembersSuccess,
  programMembersFailed,
  setFilter,
} = programMembersSlice.actions;

export default programMembersSlice.reducer;

export const getProgramMembers = (
  data: GetProgramMembersRequestType,
): AppThunk => async (dispatch) => {
  dispatch(programMembersRequesting());
  getProgramMembersAPI(data).then(
    (response: GetProgramMembersResponseType): void => {
      dispatch(programMembersSuccess(response));
    },
    (error: any): void => {
      dispatch(programMembersFailed());
      callSnackbar({
        message: 'Failed to get program members data!',
        messageType: 'error',
      });
    },
  );
};
