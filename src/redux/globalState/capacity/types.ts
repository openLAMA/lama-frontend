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

export type CapacityShiftType = 'First' | 'Second';

export type CapacityOverviewShiftConfirmedEmployeeType = {
  email: string;
  firstName: string;
  lastName: string;
  isCanceled: boolean;
};

export type CapacityOverviewShiftConfirmedWithoutInvitationEmployeeType = CapacityOverviewShiftConfirmedEmployeeType & {
  confirmationWithoutInvitationId: string;
};

export type CapacityOverviewShiftType = {
  shiftNumber: CapacityShiftType;
  requiredPersonnelCountShift: number;
  confirmedNotCanceledEmployeesCount: number;
  confirmedEmployees: CapacityOverviewShiftConfirmedEmployeeType[];
  fixedEmployees: CapacityOverviewShiftConfirmedEmployeeType[];
  confirmedWithoutInvitation: CapacityOverviewShiftConfirmedWithoutInvitationEmployeeType[];
};

export type CantonType = {
  cantonId: string;
  cantonName: string;
  cantonShortName: string;
  samples: number;
};

export type CapacityOverviewType = {
  invitationId: string;
  date: string;
  samples: number;
  totalSamples: number;
  cantonsSamples: number;
  invitationAlreadySent: boolean;
  shifts: CapacityOverviewShiftType[];
  cantonsSamplesData: CantonType[];
};

export type GetCapacityOverviewResponseType = {
  isEarliestDate: boolean;
  testsData: CapacityOverviewType[];
};

export type GetCapacityOverviewRequestType = {
  startDate: string;
};

export type AddStateRequestType = {
  name: string;
  shortName: string;
  cantonWeekdaysSamples: {
    mondaySamples: number;
    tuesdaySamples: number;
    wednesdaySamples: number;
    thursdaySamples: number;
    fridaySamples: number;
  };
};

export type GetStateRequestType = {
  id: string;
};

export type GetStateResponseType = {
  name: string;
  shortName: string;
  cantonWeekdaysSamples: {
    mondaySamples: number;
    tuesdaySamples: number;
    wednesdaySamples: number;
    thursdaySamples: number;
    fridaySamples: number;
    cantonId: string;
    id: string;
  };
  countryId: string;
  id: string;
};

export type UpdateStateRequestType = {
  name: string;
  shortName: string;
  cantonWeekdaysSamples: {
    mondaySamples: number;
    tuesdaySamples: number;
    wednesdaySamples: number;
    thursdaySamples: number;
    fridaySamples: number;
    cantonId: string;
    id: string;
  };
  countryId: string;
  id: string;
};

export type RemoveStateRequestType = {
  id: string;
};
