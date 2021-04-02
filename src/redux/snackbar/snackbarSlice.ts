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

import { NotificationType } from 'redux/snackbar/types';

interface ISnackBar {
  notifications: NotificationType[];
}

const initialState = {
  notifications: [],
} as ISnackBar;

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    enqueueSnackbar(state, action: PayloadAction<NotificationType>) {
      const autoHideDuration = 5000;
      const newNotification: NotificationType = {
        key: new Date().getTime() + Math.random(),
        ...action.payload,
        options: {
          ...action.payload.options,
          autoHideDuration:
            action.payload.options.variant !== 'error'
              ? autoHideDuration
              : null,
        },
      };
      state.notifications = [...state.notifications, newNotification];
    },
    closeSnackbar(state, action: PayloadAction<number>) {
      const dismissAll = Boolean(action.payload);
      state.notifications = state.notifications.map(
        (notification: NotificationType) =>
          dismissAll || notification.key === action.payload
            ? { ...notification, dismissed: true }
            : { ...notification },
      );
    },
    removeSnackbar(state, action: PayloadAction<number>) {
      state.notifications = state.notifications.filter(
        (notification: NotificationType) => notification.key !== action.payload,
      );
    },
    closeAllNonSuccessSnackbar(state) {
      state.notifications = state.notifications.map((notification) =>
        notification.message.messageType !== 'success'
          ? { ...notification, dismissed: true }
          : { ...notification },
      );
    },
  },
});

export const {
  enqueueSnackbar,
  closeSnackbar,
  removeSnackbar,
  closeAllNonSuccessSnackbar,
} = snackbarSlice.actions;

export default snackbarSlice.reducer;
