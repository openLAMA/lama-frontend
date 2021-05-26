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
import { compareDesc, parseISO } from 'date-fns';
import { extractErrorMessage } from 'apiService/axiosInstance';

// Types
import { IApiStatus } from 'redux/globalTypes';
import {
  NoteItemType,
  GetNotesRequestType,
  GetNotesResponseType,
  PostNoteRequestType,
} from 'redux/onboardingAndTrainingAdministration/Notes/types';
import { ErrorObjectType } from 'apiService/types';

import {
  getNotesAPI,
  postNoteAPI,
} from 'redux/onboardingAndTrainingAdministration/Notes/notesSliceApi';

interface INotes {
  notes: NoteItemType[];
  notesStatus: IApiStatus;
  postNoteStatus: IApiStatus;
}

const initialState = {
  notes: [],
  notesStatus: {
    requesting: true,
    success: false,
    failure: false,
  },
  postNoteStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as INotes;

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    getNotesRequesting(state) {
      state.notesStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getNotesSuccess(state, action: PayloadAction<GetNotesResponseType>) {
      state.notes =
        action.payload.result?.sort((a, b) =>
          compareDesc(parseISO(a.createdOn), parseISO(b.createdOn)),
        ) || [];
      state.notesStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getNotesFailed(state) {
      state.notesStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    postNoteRequesting(state) {
      state.postNoteStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    postNoteSuccess(state) {
      state.postNoteStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    postNoteFailed(state) {
      state.postNoteStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    resetNotes(state) {
      state = initialState;
    },
  },
});

export const {
  getNotesRequesting,
  getNotesSuccess,
  getNotesFailed,
  postNoteRequesting,
  postNoteSuccess,
  postNoteFailed,
  resetNotes,
} = notesSlice.actions;

export default notesSlice.reducer;

export const getNotes = (data: GetNotesRequestType): AppThunk => async (
  dispatch,
) => {
  dispatch(getNotesRequesting());
  getNotesAPI(data).then(
    (response: GetNotesResponseType): void => {
      dispatch(getNotesSuccess(response));
    },
    (error: ErrorObjectType): void => {
      dispatch(getNotesFailed());
      extractErrorMessage(error, 'Failed to get notes!');
    },
  );
};

export const postNote = (data: PostNoteRequestType): AppThunk => async (
  dispatch,
) => {
  dispatch(postNoteRequesting());
  postNoteAPI(data).then(
    (): void => {
      dispatch(postNoteSuccess());
    },
    (error: ErrorObjectType): void => {
      dispatch(postNoteFailed());
      extractErrorMessage(error, 'Failed to add a new note!');
    },
  );
};
