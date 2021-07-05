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
import callSnackbar from 'utils/customHooks/useSnackbar';

// Types
import { ErrorObjectType } from 'apiService/types';

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
  (error: any) => {
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
interface IErrorMessagesMapping {
  [key: string]: {
    message: string;
    dynamicDataKey: string;
  };
}

const errorMessagesMapping: IErrorMessagesMapping = {
  'User has duplicate area of responsibility': {
    message: 'Invitation for X has already been sent',
    dynamicDataKey: 'date',
  },
  'Invitation for the date has already been sent': {
    message: 'Invitation for X has already been sent',
    dynamicDataKey: 'date',
  },
  'Already existing emails': {
    message: 'Emails already exist',
    dynamicDataKey: 'emails',
  },
  'Testing personnel with this email already exists': {
    message: 'Testing personnel with email X already exists',
    dynamicDataKey: 'email',
  },
  'Fixed testing personnel with email was not found': {
    message: 'Fixed testing personnel with email X was not found',
    dynamicDataKey: 'email',
  },
  'Cancelation for testing personnel for date already exists': {
    message: 'Cancelation for testing personnel for date X already exists',
    dynamicDataKey: 'date',
  },
  'User that you want to delete is assigned to an Organization': {
    message: 'User that you want to delete is assigned to an Organization',
    dynamicDataKey: 'emails',
  },
};

const getErrorMessage = (error: AxiosError) => {
  const errorData = error?.response?.data || null;
  let errorObject: ErrorObjectType = {
    showGenericMessage: true,
  };
  let hasDynamicError = false;
  if (!errorData || !errorData.errors || typeof errorData === 'string')
    return errorObject;

  Object.keys(errorMessagesMapping).forEach((key) => {
    if (errorData.errors[key]) {
      const datesList = errorData.errors[key];
      if (datesList instanceof Array && datesList.length !== 0) {
        const errorMessageData = errorMessagesMapping[key];
        errorObject = {
          dynamicData: {
            [`${errorMessageData.dynamicDataKey}`]: datesList[0],
          },
          message: errorMessageData.message,
        };
      }
      hasDynamicError = true;
    }
  });

  if (hasDynamicError) {
    return errorObject;
  }

  const errorKeys = Object.keys(errorData.errors);
  if (errorKeys.length === 0) return error;
  errorObject = {
    message: errorData.errors[errorKeys[0]][0],
  };
  return errorObject;
};

const handle400 = (error: AxiosError) => {
  return getErrorMessage(error);
};

const handle401 = (error: AxiosError) => {
  store.dispatch(clearAuthData());
  return getErrorMessage(error);
};

const handle404 = (error: AxiosError) => {
  return getErrorMessage(error);
};

const handle409 = (error: AxiosError) => {
  return getErrorMessage(error);
};

const handle500 = () => {
  const errorObject = {};
  return errorObject;
};

export default axiosInstance;

export const extractErrorMessage = (
  error: ErrorObjectType,
  errorMessage: string,
) => {
  if (error?.dynamicData) {
    callSnackbar({
      message: error.message,
      dynamicData: error.dynamicData,
      messageType: 'error',
    });
  } else if (error?.message) {
    callSnackbar({
      message: error.message,
      messageType: 'error',
    });
  } else {
    callSnackbar({
      message: errorMessage,
      messageType: 'error',
    });
  }
};
