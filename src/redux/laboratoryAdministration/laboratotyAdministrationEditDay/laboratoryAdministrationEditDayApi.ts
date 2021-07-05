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
  GetLaboratoryAdministrationEditDayRequestType,
  GetLaboratoryAdministrationEditDayResponseType,
  RemoveLaboratoryAdministrationConfirmedPersonRequestType,
  GetLaboratoryAdministrationEmployeesResponseType,
  AddLaboratoryAdministrationEmployeeToShiftRequestType,
  IncreaseShiftCountForDayLaboratoryAdministrationRequestType,
  AddLaboratoryAdministrationTemporaryEmployeeToShiftRequestType,
  GetLaboratoryAdministrationTemporaryEmployeesResponseType,
  RemoveLaboratoryAdministrationTemporaryEmploeeRequestType,
  GetLaboratoryAdministrationTemporaryEmployeesRequestType,
} from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/types';

export const getLaboratoryAdministrationEditDayDataAPI = async (
  params: GetLaboratoryAdministrationEditDayRequestType,
): Promise<GetLaboratoryAdministrationEditDayResponseType> =>
  HttpClient.request<GetLaboratoryAdministrationEditDayResponseType>({
    url: `laboratory/testsForDate`,
    params,
    method: APIMethods.GET,
  });

export const removeLaboratoryAdministrationConfirmedEmployeeAPI = async (
  data: RemoveLaboratoryAdministrationConfirmedPersonRequestType,
  isFixed?: boolean,
): Promise<null> =>
  HttpClient.request<null>({
    url: isFixed
      ? `laboratory/fixedPersonnel/cancelForDate`
      : `laboratory/invitations/cancelConfirmation`,
    data,
    method: isFixed ? APIMethods.POST : APIMethods.PUT,
  });

export const getLaboratoryAdministrationEmployeesAPI = async (): Promise<GetLaboratoryAdministrationEmployeesResponseType> =>
  HttpClient.request<GetLaboratoryAdministrationEmployeesResponseType>({
    url: 'laboratory/testingPersonnel',
    method: APIMethods.GET,
  });

export const addLaboratoryAdministrationEmployeeToShiftAPI = async (
  data: AddLaboratoryAdministrationEmployeeToShiftRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'laboratory/invitations/createConfirmation',
    data,
    method: APIMethods.POST,
  });

export const increaseShiftCountForDayLaboratoryAdministrationAPI = async (
  data: IncreaseShiftCountForDayLaboratoryAdministrationRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'laboratory/invitations/increaseShiftCount',
    data,
    method: APIMethods.PUT,
  });

export const getLaboratoryAdministrationTemporaryEmployeesAPI = async (
  params: GetLaboratoryAdministrationTemporaryEmployeesRequestType,
): Promise<GetLaboratoryAdministrationTemporaryEmployeesResponseType> =>
  HttpClient.request<GetLaboratoryAdministrationTemporaryEmployeesResponseType>(
    {
      url: 'laboratory/availableTemporaryPersonal',
      method: APIMethods.GET,
      params,
    },
  );

export const addLaboratoryAdministrationTemporaryEmployeeToShiftAPI = async (
  data: AddLaboratoryAdministrationTemporaryEmployeeToShiftRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: 'laboratory/confirmationsWithoutInvitation',
    data,
    method: APIMethods.POST,
  });

export const removeLaboratoryAdministrationTemporaryEmployeeAPI = async (
  data: RemoveLaboratoryAdministrationTemporaryEmploeeRequestType,
): Promise<null> =>
  HttpClient.request<null>({
    url: `laboratory/confirmationsWithoutInvitation/${data.id}`,
    method: APIMethods.DELETE,
  });
