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

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, batch } from 'react-redux';

// Custom components
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';
import CampsSendToEpaadModal from 'components/Modals/CampsSendToEpaadModal';

// Actions
import {
  pushToEpaadProgramMember,
  clearUpdateProgramData,
  getProgramMember,
} from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberSlice';

// Utils
import { RootState } from 'redux/combineReducers';
import programMemberStatusEnum from 'utils/programMemberStatusEnum';
import organizationTypesEnum from 'utils/organizationTypesEnum';

const SendToEpaad: React.FC = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [openCampModal, setCampModal] = useState<boolean>(false);

  const programMember = useSelector(
    (state: RootState) => state.editProgramMemberData.programMember,
  );

  const pushToEpaadProgramMemberStatus = useSelector(
    (state: RootState) =>
      state.editProgramMemberData.pushToEpaadProgramMemberStatus,
  );

  useEffect(() => {
    if (pushToEpaadProgramMemberStatus.success) {
      const id = programMember.id;
      batch(() => {
        dispatch(clearUpdateProgramData());
        dispatch(getProgramMember(id));
      });
    }
  }, [pushToEpaadProgramMemberStatus]);

  const onSendToEpaad = () => {
    if (programMember.organizationTypeId === organizationTypesEnum.CAMP) {
      setCampModal(true);
    } else {
      dispatch(pushToEpaadProgramMember(programMember));
    }
  };

  const isReadOnly = programMember.status === programMemberStatusEnum.NotActive;

  return (
    <>
      <ButtonWithLoadingAnimation
        variant="contained"
        color="primary"
        isLoading={pushToEpaadProgramMemberStatus.requesting}
        onClick={onSendToEpaad}
        text={t('common:Send to Epaad')}
        backgroundColor="#FAC710"
        hoverBackgroundColor="#c29700"
        textColor="#000"
        disabled={
          isReadOnly ||
          Boolean(programMember.epaadId) ||
          programMember.organizationTypeId === organizationTypesEnum.School
        }
      />
      {openCampModal && (
        <CampsSendToEpaadModal
          onClose={() => {
            setCampModal(false);
          }}
          programMemberId={programMember.id}
        />
      )}
    </>
  );
};

export default SendToEpaad;
