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

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// Actions
import {
  removeSnackbar,
  closeAllNonSuccessSnackbar,
} from 'redux/snackbar/snackbarSlice';

let displayed = [];

// Jsx because of problems with the types
const SnackbarAlert = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const notifications = useSelector(
    (state) => state.snackbar.notifications || [],
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(closeAllNonSuccessSnackbar());
  }, [location]);

  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  React.useEffect(() => {
    notifications.forEach(
      ({ key, message, options = {}, dismissed = false }) => {
        if (dismissed) {
          // dismiss snackbar using notistack
          closeSnackbar(key);
          return;
        }

        // do nothing if snackbar is already displayed
        if (displayed.includes(key)) return;

        // display snackbar using notistack
        enqueueSnackbar(message, {
          key,
          ...options,
          onClose: (event, reason, myKey) => {
            if (options.onClose) {
              options.onClose(event, reason, myKey);
            }
          },
          onExited: (event, myKey) => {
            // remove this snackbar from redux store
            dispatch(removeSnackbar(myKey));
            removeDisplayed(myKey);
          },
        });

        // keep track of snackbars that we've displayed
        storeDisplayed(key);
      },
    );
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export default SnackbarAlert;
