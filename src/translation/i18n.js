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

import i18n from 'i18next';
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend'; // primary use cache
import HttpApi from 'i18next-http-backend'; // fallback http load
import { initReactI18next } from 'react-i18next';
import { Env } from 'utils/environment';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'de',
    debug: Env.get() !== 'production' ? true : false,
    fallbackLng: 'de',
    ns: [
      'common',
      'nav',
      'tooltips',
      'modals',
      'APIErrorMessages',
      'APISuccessMessages',
      'progressMessages',
      'formValidation',
      'aria',
    ],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      backends: [LocalStorageBackend, HttpApi],
      backendOptions: [
        {
          defaultVersion: 'v0.2.32',
          expirationTime: 7 * 24 * 60 * 60 * 1000,
          store: window.localStorage,
        },
        {
          loadPath: '/locales/{{lng}}/{{ns}}.json', // xhr load path for my own fallback
        },
      ],
    },
  });

export default i18n;
