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

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

// Material UI
import { Grid, FormControlLabel, Switch } from '@material-ui/core';

// Custom components
import CircularLoading from 'components/loaders/CircularLoading';

// Actions
import { updateStaticPoolingStatus as updateStaticPoolingStatusAction } from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberSlice';

import { UpdateStaticPoolingRequestType } from 'redux/onboardingAndTrainingAdministration/EditProgramMember/types';
// Utils
import { RootState } from 'redux/combineReducers';

const StaticPooling: React.FC = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [switchStatus, setSwitchStatus] = useState<boolean>(false);

  const isStaticPooling = useSelector(
    (state: RootState) =>
      state.editProgramMemberData.programMember.isStaticPooling,
  );

  const programMemberId = useSelector(
    (state: RootState) => state.editProgramMemberData.programMember.id,
  );

  const updateStaticPoolingStatus = useSelector(
    (state: RootState) => state.editProgramMemberData.updateStaticPoolingStatus,
  );

  const onUpdateStaticPooling = () => {
    setSwitchStatus(!switchStatus);
    const data: UpdateStaticPoolingRequestType = {
      id: programMemberId,
      isStaticPooling: !isStaticPooling,
    };
    dispatch(updateStaticPoolingStatusAction(data));
  };

  useEffect(() => {
    setSwitchStatus(isStaticPooling || false);
  }, [isStaticPooling]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={switchStatus}
                onChange={onUpdateStaticPooling}
                name="statusPooling"
                disabled={updateStaticPoolingStatus.requesting}
              />
            }
            label={t('Static pooling')}
            className="text-no-wrap"
          />
        </Grid>

        {updateStaticPoolingStatus.requesting && (
          <Grid item xs={6}>
            <CircularLoading size={16} />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default StaticPooling;
