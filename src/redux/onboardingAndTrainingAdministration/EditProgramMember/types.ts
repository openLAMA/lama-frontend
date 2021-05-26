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
import { SupportPersonSelectType, ContactPersonType } from 'redux/globalTypes';

import {
  ProgramMemberType,
  FollowUpStatusType,
} from 'redux/globalState/programMembers/types';

export type SupportPeopleForOrganizationType = SupportPersonSelectType[];

export type PutProgramMemberType = {
  epaadId?: string;
  id: string;
  name: string;
  organizationTypeId: number;
  cityId: string;
  zip: string;
  address: string;
  trainingTimestamp: string | null;
  onboardingTimestamp: string | null;
  firstTestTimestamp?: string | null;
  secondTestTimestamp?: string | null;
  thirdTestTimestamp?: string | null;
  fourthTestTimestamp?: string | null;
  fifthTestTimestamp?: string | null;
  exclusionStartDate?: string | null;
  exclusionEndDate?: string | null;
  numberOfSamples: number | null;
  numberOfPools: number | null;
  contacts: ContactPersonType[];
  subOrganizations: [
    {
      name: string;
      address: string;
      organizationId: string;
      id: string;
    },
  ];
  supportPersonId: string;
  status:
    | 'NotActive'
    | 'NotConfirmed'
    | 'Onboarded'
    | 'PendingContact'
    | 'PendingOnboarding'
    | 'TrainingDateSet';
  manager?: string | null;
  studentsCount?: number | null;
  employeesCount?: number | null;
  registeredEmployees?: number | null;
  area?: string | null;
  county?: string | null;
  prioLogistic?: number | null;
  schoolType?: string | null;
  numberOfBags?: number | null;
  naclLosing?: number | null;
  additionalTestTubes?: number | null;
  numberOfRakoBoxes?: number | null;
  pickupLocation?: string | null;
  organizationShortcutName?: string | null;
};

export type GetProgramMemberRequestType = string;

export type GetProgramMemberResponseType = ProgramMemberType;

export type GetSupportPeopleForOrganizationRequestType = {
  organizationTypeId: string;
};

export type GetSupportPeopleForOrganizationResponseType = SupportPeopleForOrganizationType;

export type PutSupportPeopleForOrganizationRequestType = PutProgramMemberType;

export type DeactivateProgramMemberRequestType = {
  id: string;
  isActive: boolean;
};

export type PushToEpaadProgramMemberRequestType = PutProgramMemberType;

export type PutFollowUpStatus = {
  organizationId: string;
  newStatus: FollowUpStatusType;
};
