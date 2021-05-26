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

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

// Material UI
import { Grid, MenuItem } from '@material-ui/core';

// Custom components
import CustomSelect from 'components/CustomSelect';
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';

// Actions
import { updateFollowUpStatus } from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberSlice';

// Types
import { FollowUpStatusType } from 'redux/globalState/programMembers/types';

// utils
import { RootState } from 'redux/combineReducers';
import programMemberFollowUpStatusEnum from 'utils/programMemberFollowUpStatusEnum';

const followUpStatusList = ['NotSent', 'Sent', 'Accepted', 'Declined'];

// Not used.
const FollowUpChange: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const programMember = useSelector(
    (state: RootState) => state.editProgramMemberData.programMember,
  );

  const updateFollowUpStatusStatus = useSelector(
    (state: RootState) =>
      state.editProgramMemberData.updateFollowUpStatusStatus,
  );

  const [selectedStatus, setSelectedStatus] = useState<FollowUpStatusType>(
    programMember.followUpStatus,
  );

  const inUpdateFollowUpStatus = () => {
    dispatch(
      updateFollowUpStatus({
        organizationId: programMember.id,
        newStatus: selectedStatus,
      }),
    );
  };

  const isReadOnly =
    programMember.followUpStatus === programMemberFollowUpStatusEnum.NotSent;

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <CustomSelect
          minWidth="200px"
          variant="outlined"
          label={t('common:Follow up status')}
          labelId="followUpStatus"
          selectId="followUpStatus"
          inputLabelClassName="bg-color-gray"
          value={selectedStatus}
          onChange={(event) => {
            setSelectedStatus(event?.target.value as FollowUpStatusType);
          }}
          disabled={isReadOnly || updateFollowUpStatusStatus.requesting}
          menuItems={followUpStatusList.map((followUpStatusItem: any) => {
            return (
              <MenuItem
                key={followUpStatusItem}
                value={followUpStatusItem}
                disabled={
                  followUpStatusItem === programMemberFollowUpStatusEnum.NotSent
                }>
                {t(`common:${followUpStatusItem}`)}
              </MenuItem>
            );
          })}
        />
      </Grid>
      <Grid item>
        <ButtonWithLoadingAnimation
          text={t('common:Save')}
          color="primary"
          variant="contained"
          isLoading={updateFollowUpStatusStatus.requesting}
          onClick={inUpdateFollowUpStatus}
          disabled={isReadOnly}
        />
      </Grid>
    </Grid>
  );
};

export default FollowUpChange;
