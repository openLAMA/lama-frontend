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

import { HttpClient } from 'apiService';
import { APIMethods } from 'apiService/types';

import {
  GetGeneralMyProfileRequestType,
  GetGeneralMyProfileResponseType,
  UpdateGeneralMyProfileRequestType,
} from 'redux/globalState/generalMyProfile/types';

export const getGeneralMyProfileAPI = async (
  params: GetGeneralMyProfileRequestType,
): Promise<GetGeneralMyProfileResponseType> =>
  HttpClient.request<GetGeneralMyProfileResponseType>({
    url: 'profile',
    method: APIMethods.GET,
    params,
  });

export const updateGeneralMyProfileAPI = async (
  data: UpdateGeneralMyProfileRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'profile',
    method: APIMethods.PUT,
    data,
  });
