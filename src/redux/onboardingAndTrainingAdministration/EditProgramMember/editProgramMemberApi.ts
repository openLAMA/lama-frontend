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
  GetProgramMemberRequestType,
  GetProgramMemberResponseType,
  GetSupportPeopleForOrganizationRequestType,
  GetSupportPeopleForOrganizationResponseType,
  PutSupportPeopleForOrganizationRequestType,
  DeactivateProgramMemberRequestType,
  ReActivateProgramMemberRequestType,
  PushToEpaadProgramMemberRequestType,
  PutFollowUpStatus,
  UpdateStaticPoolingRequestType,
  CampSendEmailEpaadRequestType,
} from 'redux/onboardingAndTrainingAdministration/EditProgramMember/types';

export const getProgramMemberAPI = async (
  id: GetProgramMemberRequestType,
): Promise<GetProgramMemberResponseType> =>
  HttpClient.request<GetProgramMemberResponseType>({
    url: `organizations/${id}`,
    method: APIMethods.GET,
  });

export const getSupportPeopleForOrganizationAPI = async (
  params: GetSupportPeopleForOrganizationRequestType,
): Promise<GetSupportPeopleForOrganizationResponseType> =>
  HttpClient.request<GetSupportPeopleForOrganizationResponseType>({
    url: 'university',
    method: APIMethods.GET,
    params,
  });

export const putSupportPeopleForOrganizationAPI = async (
  data: PutSupportPeopleForOrganizationRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'organizations',
    method: APIMethods.PUT,
    data,
  });

export const deactivateProgramMemberAPI = async (
  data: DeactivateProgramMemberRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'organizations/activeStatus',
    method: APIMethods.POST,
    data,
  });

export const reActivateProgramMemberAPI = async (
  data: ReActivateProgramMemberRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'organizations/activeStatus',
    method: APIMethods.POST,
    data,
  });

export const pushToEpaadProgramMemberAPI = async (
  data: PushToEpaadProgramMemberRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'organizations/pushToEpaad',
    method: APIMethods.POST,
    data,
  });

export const putFollowUpStatusAPI = async (
  data: PutFollowUpStatus,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'organization/followUp',
    method: APIMethods.PUT,
    data,
  });

export const updateStaticPoolingStatusAPI = async (
  data: UpdateStaticPoolingRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'organizations/setIsStaticPooling',
    method: APIMethods.POST,
    data,
  });

// TODO update url and data.
export const campSendEmailEpaadAPI = async (
  data: CampSendEmailEpaadRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'organizations/sendEmailForEpaad',
    method: APIMethods.POST,
    data,
  });
