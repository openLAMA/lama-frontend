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

/* eslint-disable no-param-reassign */
import axios, { AxiosRequestConfig, AxiosInstance, AxiosError } from 'axios';
import store from 'redux/store';
import { RootState } from 'redux/combineReducers';
import { HttpStatusCode } from 'apiService/types';

// Actions
import { clearAuthData } from 'redux/authData/authDataSlice';

const config: AxiosRequestConfig = {
  baseURL: process.env.REACT_APP_API_ENDPOINT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosInstance: AxiosInstance = axios.create(config);

axiosInstance.interceptors.request.use(
  (requestConfig: AxiosRequestConfig) => {
    const state: RootState = store.getState();
    const token = state.authData.token;
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error: AxiosError) => {
    return Promise.reject(handleAPIError(error));
  },
);

const handleAPIError = (error: AxiosError) => {
  const status = error?.response?.status;
  if (!status) return error;
  switch (status) {
    case HttpStatusCode.BAD_REQUEST: {
      // 400
      return handle400(error);
    }
    case HttpStatusCode.UNAUTHORIZED: {
      // 401
      return handle401(error);
    }
    case HttpStatusCode.NOT_FOUND: {
      // 404
      return handle404(error);
    }
    case HttpStatusCode.CONFLICT: {
      // 409
      return handle409(error);
    }
    case HttpStatusCode.INTERNAL_SERVER_ERROR: {
      // 500
      return handle500();
    }
    default:
      return error;
  }
};

const handle400 = (error: AxiosError) => {
  const errorData = error?.response?.data || null;
  if (!errorData) return error;
  if (errorData?.errors?.length === 0) return error;
  const errorObject = {};
  return errorObject;
};

const handle401 = (error: AxiosError) => {
  const errorData = error?.response?.data || null;
  store.dispatch(clearAuthData());

  if (!errorData) return error;
  if (errorData?.errors?.length === 0) return error;
  const errorObject = {};
  return errorObject;
};

const handle404 = (error: AxiosError) => {
  const errorData = error?.response?.data || null;
  if (!errorData) return error;
  if (errorData?.errors?.length === 0) return error;
  const errorObject = {};
  return errorObject;
};

const handle409 = (error: AxiosError) => {
  const errorData = error?.response?.data || null;
  if (!errorData) return error;
  if (errorData?.errors?.length === 0) return error;
  const errorObject = {};
  return errorObject;
};

const handle500 = () => {
  const errorObject = {};
  return errorObject;
};

export default axiosInstance;
