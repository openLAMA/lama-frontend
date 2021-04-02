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

import pages from 'pages';

export interface IRoute {
  route: string;
  key: string;
  title: string;
  redirectRoute?: string;
  viewName: keyof typeof pages;
  exact?: boolean;
  redirectIfAuth?: boolean;
}

export interface IOnboardingAndTrainingAdministrationRoutes {
  dashboardRoute: IRoute;
  overviewRoute: IRoute;
  myProfileRoute: IRoute;
  editProgramMemberRoute: IRoute;
  capacityRoute: IRoute;
}

const university = '/university';

export const OnboardingAndTrainingAdministrationRoutes: IOnboardingAndTrainingAdministrationRoutes = {
  overviewRoute: {
    route: `${university}/overview`,
    key: `${university}/overview`,
    title: 'Overview',
    viewName: 'OnboardingAndTrainingAdministrationOverview',
    exact: true,
  },
  myProfileRoute: {
    route: `${university}/my-profile`,
    key: `${university}/my-profile`,
    title: 'My Profile',
    viewName: 'OnboardingAndTrainingAdministrationMyProfile',
    exact: true,
  },
  editProgramMemberRoute: {
    route: `${university}/edit-program-member/:id`,
    redirectRoute: `${university}/edit-program-member`,
    key: `${university}/edit-program-member`,
    title: 'Edit program member',
    viewName: 'OnboardingAndTrainingAdministrationEditProgramMember',
  },
  capacityRoute: {
    route: `${university}/my-profile/capacity`,
    key: `${university}/my-profile/capacity`,
    title: 'Capacity',
    viewName: 'OnboardingAndTrainingAdministrationCapacity',
    exact: true,
  },
  dashboardRoute: {
    route: `${university}`,
    key: `${university}`,
    title: 'Dashboard',
    viewName: 'OnboardingAndTrainingAdministrationDashboard',
    exact: true,
  },
};

export interface IOrganizationAdministrationRoutes {
  dashboardRoute: IRoute;
  myProfileRoute: IRoute;
}

const organization = '/organization';

export const OrganizationAdministrationRoutes: IOrganizationAdministrationRoutes = {
  dashboardRoute: {
    route: `${organization}`,
    key: `${organization}`,
    title: 'Dashboard',
    viewName: 'OrganizationAdministrationDashboard',
    exact: true,
  },
  myProfileRoute: {
    route: `${organization}/my-profile`,
    key: `${organization}/my-profile`,
    title: 'My Profile',
    viewName: 'OrganizationAdministrationMyProfile',
    exact: true,
  },
};

export interface ILabAdministrationRoutes {
  dashboardRoute: IRoute;
  myProfileRoute: IRoute;
  programMembersRoute: IRoute;
  testingPersonalRoute: IRoute;
}

const laboratory = '/laboratory';

export const LabAdministrationRoutes: ILabAdministrationRoutes = {
  dashboardRoute: {
    route: `${laboratory}`,
    key: `${laboratory}`,
    title: 'Dashboard',
    viewName: 'LabAdministrationDashboard',
    exact: true,
  },
  myProfileRoute: {
    route: `${laboratory}/my-profile`,
    key: `${laboratory}/my-profile`,
    title: 'My Profile',
    viewName: 'LabAdministrationMyProfile',
    exact: true,
  },
  programMembersRoute: {
    route: `${laboratory}/program-members`,
    key: `${laboratory}/program-members`,
    title: 'Overview',
    viewName: 'LabAdministrationProgramMembers',
    exact: true,
  },
  testingPersonalRoute: {
    route: `${laboratory}/testing-personal`,
    key: `${laboratory}/testing-personal`,
    title: 'Testing personal',
    viewName: 'LabAdministrationTestingPersonal',
    exact: true,
  },
};

export interface IUnauthenticatedRoutes {
  loginRoute: IRoute;
  signUpRoute: IRoute;
  organizationRegistrationRoute: IRoute;
  organizationRegistrationCompleteRoute: IRoute;
  loginConfirmationRoute: IRoute;
  registerConfirmationRoute: IRoute;
  testingPersonalInvitationRoute: IRoute;
  loginEmailSentRoute: IRoute;
}

export const UnauthenticatedRoutes: IUnauthenticatedRoutes = {
  loginRoute: {
    route: '/',
    key: '/',
    title: 'Login',
    viewName: 'Login',
    exact: true,
    redirectIfAuth: true,
  },
  signUpRoute: {
    route: '/sign-up',
    key: '/sign-up',
    title: 'Sign up',
    viewName: 'SignUp',
    exact: true,
    redirectIfAuth: true,
  },
  organizationRegistrationRoute: {
    route: '/organization-registration',
    key: '/organization-registration',
    title: 'Organization Registration',
    viewName: 'OrganizationRegistration',
    exact: true,
    redirectIfAuth: true,
  },
  organizationRegistrationCompleteRoute: {
    route: '/organization-registration-complete',
    key: '/organization-registration-complete',
    title: 'Organization Registration Complete',
    viewName: 'OrganizationRegistrationComplete',
    exact: true,
    redirectIfAuth: true,
  },
  loginConfirmationRoute: {
    route: '/login-confirmation',
    key: '/login-confirmation',
    title: 'Login confirmation',
    viewName: 'LoginConfirmation',
    exact: true,
  },
  registerConfirmationRoute: {
    route: '/register-confirmation',
    key: '/register-confirmation',
    title: 'Register confirmation',
    viewName: 'RegisterConfirmation',
    exact: true,
  },
  testingPersonalInvitationRoute: {
    route: '/poolingassignment-confirmation',
    key: '/poolingassignment-confirmation',
    title: 'Testing personal invitation',
    viewName: 'TestingPersonalInvitationConfirmation',
    exact: true,
  },
  loginEmailSentRoute: {
    route: '/login-email-sent',
    key: '/login-email-sent',
    title: 'Login email sent',
    viewName: 'LoginEmailSent',
    exact: true,
    redirectIfAuth: true,
  },
};
