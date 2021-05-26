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

export interface Error {
  message: string;
}

export interface IApiStatus {
  requesting: boolean;
  success: boolean;
  failure: boolean;
}

export type RoleType =
  | 'Organization'
  | 'University'
  | 'Laboratory'
  | 'Logistics'
  | '';

export type OrganizationTypeType = {
  id: number;
  name: string;
};

export type SupportPersonType = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  landLineNumber: string;
};

export type SupportPersonSelectType = {
  supportPersonId: string;
  name: string;
};

export type ContactPersonType = {
  id?: string;
  email: string;
  name: string;
  phoneNumber: string;
  landLineNumber?: string;
};

export type ChartTimePeriod = 'Today' | '7Days' | '28Days' | '90Days';
export type OverallChartTimePeriod = 'TotalInTesting';

export type ShiftType = 'None' | 'First' | 'Second' | 'FullDay';
