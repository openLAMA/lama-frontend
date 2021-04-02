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

import { AxiosRequestConfig } from 'axios';
import qs from 'qs';

import axiosInstance from 'apiService/axiosInstance';

// Types
import { APIMethods } from 'apiService/types';

interface IHttpClientRequestParameters {
  url: string;
  method: APIMethods;
  data?: any;
  params?: any;
  formData?: any;
  onUploadProgress?: (progressEvent: any) => void;
}

export type ErrorObject = {
  message: string;
  fieldErrors: {
    [key: string]: string[];
  };
};

export interface INoContent {
  noContent: boolean;
}

export class HttpClient {
  static request<T>(requestParams: IHttpClientRequestParameters): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const {
        url,
        method,
        data,
        params,
        formData,
        onUploadProgress,
      } = requestParams;

      const requestConfig: AxiosRequestConfig = {
        url,
        method,
        headers: {},
        onUploadProgress,
      };

      if (formData) {
        requestConfig.headers.contentType = 'multipart/form-data';
      }

      if (data) {
        requestConfig.data = data;
      }

      if (params) {
        requestConfig.params = params;
        requestConfig.paramsSerializer = (t) => qs.stringify(t);
      }

      axiosInstance(requestConfig)
        .then((response: any) => {
          resolve(response.data as T);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}
