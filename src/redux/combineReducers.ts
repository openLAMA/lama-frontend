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

import { combineReducers } from '@reduxjs/toolkit';

import authDataReducer from 'redux/authData/authDataSlice';
import authReducer from 'redux/auth/authSlice';
import snackbarReducer from 'redux/snackbar/snackbarSlice';
import citiesReducer from 'redux/globalState/citiesData/citiesDataSlice';
import organizationTypesReducer from 'redux/globalState/organizationTypes/organizationTypesSlice';
import supportPersonReducer from 'redux/globalState/supportPerson/supportPersonSlice';
import programMembersDataReducer from 'redux/globalState/programMembers/programMembersSlice';
import testingPersonalInvitationConfirmationReducer from 'redux/testingPersonalInvitationConfirmation/testingPersonalInvitationConfirmationSlice';
import organizationRegistrationDataReducer from 'redux/organizationRegistration/organizationRegistrationSlice';
import organizationAdministrationDashboardDataReducer from 'redux/organizationAdministration/organizationAdministrationDashboard/organizationAdministrationDashboardSlice';
import organizationAdministrationMyProfileDataReducer from 'redux/organizationAdministration/organizationAdministrationMyProfile/organizationAdministrationMyProfileSlice';
import laboratoryAdministrationDashboardDataReducer from 'redux/laboratoryAdministration/laboratoryAdministrationDashboard/laboratoryAdministrationDashboardSlice';
import laboratoryTestingPersonalDataReducer from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/organizationAdministrationTestingPersonalSlice';
import editProgramMemberReducer from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberSlice';
import capacityReducer from 'redux/globalState/capacity/capacitySlice';
import generalMyProfileReducer from 'redux/globalState/generalMyProfile/generalMyProfileSlice';
import navDrawerReducer from 'redux/globalState/navDrawer/navDrawerSlice';
import notesReducer from 'redux/onboardingAndTrainingAdministration/Notes/notesSliceSlice';
import followUpEmailReducer from 'redux/followUpEmail/followUpEmailSlice';
import followUpEmailConfirmationReducer from 'redux/followUpEmailConfirmation/followUpEmailConfirmationSlice';
import chartsReducer from 'redux/globalState/charts/chartsSlice';
import languageStateReducer from 'redux/globalState/languageState/languageStateSlice';
import laboratoryAdministrationEditDaySliceReducer from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/laboratoryAdministrationEditDaySlice';
import logisticsAdministrationDashboardSliceReducer from 'redux/logisticsAdministration/logisticsAdministrationDashboard/logisticsAdministrationDashboardSlice';

const rootReducer = combineReducers({
  authData: authDataReducer,
  auth: authReducer,
  snackbar: snackbarReducer,
  cities: citiesReducer,
  organizationTypes: organizationTypesReducer,
  supportPerson: supportPersonReducer,
  programMembersData: programMembersDataReducer,
  testingPersonalInvitationConfirmation: testingPersonalInvitationConfirmationReducer,
  organizationRegistrationData: organizationRegistrationDataReducer,
  organizationAdministrationDashboardData: organizationAdministrationDashboardDataReducer,
  organizationAdministrationMyProfileData: organizationAdministrationMyProfileDataReducer,
  laboratoryAdministrationDashboardData: laboratoryAdministrationDashboardDataReducer,
  laboratoryTestingPersonalData: laboratoryTestingPersonalDataReducer,
  editProgramMemberData: editProgramMemberReducer,
  capacity: capacityReducer,
  generalMyProfile: generalMyProfileReducer,
  navDrawer: navDrawerReducer,
  notes: notesReducer,
  followUpEmail: followUpEmailReducer,
  followUpEmailConfirmation: followUpEmailConfirmationReducer,
  charts: chartsReducer,
  languageState: languageStateReducer,
  laboratoryAdministrationEditDay: laboratoryAdministrationEditDaySliceReducer,
  logisticsAdministrationDashboard: logisticsAdministrationDashboardSliceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
