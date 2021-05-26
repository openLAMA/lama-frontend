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
  ConvertSecretFileRequestType,
  ConvertSecretFileResponseType,
  SecretTableType,
} from 'redux/logisticsAdministration/logisticsAdministrationDashboard/types';
import { ErrorObjectType } from 'apiService/types';

import { convertSecretFileAPI } from 'redux/logisticsAdministration/logisticsAdministrationDashboard/logisticsAdministrationDashboardApi';

interface ILogisticsAdministrationDashboard {
  convertSecretFileStatus: IApiStatus;
  data: SecretTableType | null;
  convertSecretFileProgress: number;
}

const initialState = {
  convertSecretFileStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
  convertSecretFileProgress: 0,
  data: null,
} as ILogisticsAdministrationDashboard;

const logisticsDashboardSlice = createSlice({
  name: 'logisticsDashboard',
  initialState,
  reducers: {
    convertSecretFileRequesting(state) {
      state.convertSecretFileStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    convertSecretFileSuccess(
      state,
      action: PayloadAction<ConvertSecretFileResponseType>,
    ) {
      state.data = action.payload;
      state.convertSecretFileStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    convertSecretFileError(state) {
      state.convertSecretFileStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
    setConvertFileProgress(state, action: PayloadAction<number>) {
      state.convertSecretFileProgress = action.payload;
    },
    clearConvertSecretFileData(state) {
      state.convertSecretFileStatus = initialState.convertSecretFileStatus;
      state.convertSecretFileProgress = initialState.convertSecretFileProgress;
      state.data = initialState.data;
    },
  },
});

export const {
  convertSecretFileRequesting,
  convertSecretFileSuccess,
  convertSecretFileError,
  setConvertFileProgress,
  clearConvertSecretFileData,
} = logisticsDashboardSlice.actions;

export default logisticsDashboardSlice.reducer;

export const convertSecretFile = (
  data: ConvertSecretFileRequestType,
): AppThunk => async (dispatch) => {
  const onUploadProgress = (progressEvent: any) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total,
    );
    dispatch(setConvertFileProgress(progress));
  };

  dispatch(convertSecretFileRequesting());

  convertSecretFileAPI(data, onUploadProgress).then(
    (response: ConvertSecretFileResponseType): void => {
      const parseData = response.map((item: string) => {
        return JSON.parse(item.replace(/\n/g, ''));
      });

      const bigFormat: any[] = [];

      Object.keys(parseData).forEach((key: any, index: number) => {
        if (index === 0) return;
        const currentObject = parseData[key];
        const headers = Object.keys(currentObject);
        const rotatedRows: any[] = [];

        const rows = headers.map((key) => {
          return Object.values(currentObject[key]);
        });

        for (let i = 0; i < rows[0].length; i += 1) {
          rotatedRows.push([]);
        }

        for (let i = 0; i < rows[0].length; i += 1) {
          for (let j = 0; j < rows.length; j += 1) {
            rotatedRows[i].push(rows[j][i]);
          }
        }
        bigFormat.push({
          headers,
          rows: rotatedRows,
        });
      });
      dispatch(convertSecretFileSuccess(bigFormat));
    },
    (error: ErrorObjectType): void => {
      dispatch(convertSecretFileError());

      extractErrorMessage(error, 'Failed to upload file!');
    },
  );
};
