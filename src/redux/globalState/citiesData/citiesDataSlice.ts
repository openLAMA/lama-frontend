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
  CityType,
  GetCitiesResponseType,
} from 'redux/globalState/citiesData/types';

import { getCitiesAPI } from 'redux/globalState/citiesData/citiesDataApi';

interface ICityData {
  cities: CityType[];
  citiesStatus: IApiStatus;
}

const initialState = {
  cities: [],
  citiesStatus: {
    requesting: false,
    success: false,
    failure: false,
  },
} as ICityData;

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    getCitiesRequest(state) {
      state.citiesStatus = {
        requesting: true,
        success: false,
        failure: false,
      };
    },
    getCitiesSuccess(state, action: PayloadAction<GetCitiesResponseType>) {
      state.cities = action.payload;
      state.citiesStatus = {
        requesting: false,
        success: true,
        failure: false,
      };
    },
    getCitiesFailed(state) {
      state.citiesStatus = {
        requesting: false,
        success: false,
        failure: true,
      };
    },
  },
});

export const {
  getCitiesRequest,
  getCitiesSuccess,
  getCitiesFailed,
} = citiesSlice.actions;

export default citiesSlice.reducer;

export const getCities = (): AppThunk => async (dispatch) => {
  dispatch(getCitiesRequest());
  getCitiesAPI().then(
    (response: GetCitiesResponseType): void => {
      dispatch(getCitiesSuccess(response));
    },
    (error: any): void => {
      dispatch(getCitiesFailed());
      callSnackbar({
        message: 'Failed to fetch cities list!',
        messageType: 'error',
      });
    },
  );
};
