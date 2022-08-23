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

import axiosInstance from 'apiService/axiosInstance';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/combineReducers';
import { updateMyOrganization } from 'redux/organizationAdministration/organizationAdministrationMyProfile/organizationAdministrationMyProfileSlice';
import { PutOrganizationType } from 'redux/organizationAdministration/organizationAdministrationMyProfile/types';
import styles from './styles.module.scss';

const PasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const [pwd, setPwd] = useState<string>();
  const dispatch = useDispatch();
  const [organizationData, setOrganizationData] = useState<any>({});

  const organizationId = useSelector(
    (state: RootState) => state.authData.organizationId,
  );

  const getProfileData = () => {
    axiosInstance
      .get(`organizations/profile?id=${organizationId}`)
      .then((rs) => {
        setOrganizationData(rs.data);
      });
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const submitForm = () => {
    const combinedOrganizationData: PutOrganizationType = {
      id: organizationData.id,
      name: organizationData.name,
      typeId: organizationData.organizationTypeId || 0,
      cityId: organizationData.cityId,
      ZIP: organizationData.zip,
      numberOfSamples: organizationData.numberOfSamples || 0,
      numberOfPools: organizationData.numberOfPools || null,
      address: organizationData.address,
      contacts: organizationData.contacts,
      supportPersonId: organizationData.supportPersonId,
      dataPassword: pwd,
    };
    dispatch(updateMyOrganization(combinedOrganizationData));
    setTimeout(() => {
      getProfileData();
    }, 1000);
  };
  return (
    <div className={styles['pwd-form']}>
      <h3> {t('common:Data Password')}</h3>
      {organizationData.dataPassword && (
        <div className={styles['old-pwd']}>{organizationData.dataPassword}</div>
      )}

      <div className={styles['new-pwd']}>
        <input
          onChange={(e) => setPwd(e.target.value)}
          type="password"
          placeholder={t('common:Add Text')}
        />
        <button className="btn" onClick={submitForm}>
          UPDATE
        </button>
      </div>
    </div>
  );
};
export default PasswordForm;
