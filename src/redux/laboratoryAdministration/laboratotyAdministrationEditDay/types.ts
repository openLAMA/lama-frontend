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

// Generic Types
import {
  CapacityOverviewType,
  CapacityShiftType,
} from 'redux/globalState/capacity/types';

import { GetLaboratoryTestingPersonalType } from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/types';

export type GetLaboratoryAdministrationEditDayRequestType = {
  date: string;
};

export type GetLaboratoryAdministrationEditDayResponseType = CapacityOverviewType;

export type RemoveLaboratoryAdministrationConfirmedPersonRequestType = {
  date: string;
  email: string;
  canceledByUserId: string;
};

export type GetLaboratoryAdministrationEmployeesResponseType = GetLaboratoryTestingPersonalType;

export type AddLaboratoryAdministrationEmployeeToShiftRequestType = {
  testingPersonnelId: string;
  date: string;
  shifts: CapacityShiftType[];
};

export type IncreaseShiftCountForDayLaboratoryAdministrationRequestType = {
  invitationId: string;
  shiftNumber: CapacityShiftType;
};

export type GetLaboratoryAdministrationTemporaryEmployeesRequestType = {
  date: string;
  shiftNumber: CapacityShiftType;
};

export type LaboratoryTemporaryEmployeeType = {
  testingPersonnelId: string;
  name: string;
};

export type GetLaboratoryAdministrationTemporaryEmployeesResponseType = LaboratoryTemporaryEmployeeType[];

export type AddLaboratoryAdministrationTemporaryEmployeeToShiftRequestType = {
  testingPersonnelId: string;
  date: string;
  shiftNumber: CapacityShiftType;
};

export type RemoveLaboratoryAdministrationTemporaryEmploeeRequestType = {
  id: string;
};
