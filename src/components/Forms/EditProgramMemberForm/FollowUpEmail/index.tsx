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
import { useSelector } from 'react-redux';

// Material UI
import { Button } from '@material-ui/core';

// Custom components
import SendFollowUpEmailModal from 'components/Modals/SendFollowUpEmailModal';

// Utils
import { RootState } from 'redux/combineReducers';
import programMemberStatusEnum from 'utils/programMemberStatusEnum';
import organizationTypesEnum from 'utils/organizationTypesEnum';
import shouldShowFollowUpActionButton from 'utils/shouldShowFollowUpActionButton';
import { ProgramMemberType } from 'redux/globalState/programMembers/types';

type FollowUpEmailPropsType = {
  disabled?: boolean;
  outsideTriggerOpen?: boolean;
  onCloseOutsideFollowUpModal: () => void;
};

const FollowUpEmail: React.FC<FollowUpEmailPropsType> = (
  props: FollowUpEmailPropsType,
) => {
  const { disabled, outsideTriggerOpen, onCloseOutsideFollowUpModal } = props;
  const { t } = useTranslation();

  const [
    selectedProgramMemberForSendingAFollowUpEmail,
    setSelectedProgramMemberForSendingAFollowUpEmail,
  ] = useState<ProgramMemberType | null>(null);

  const programMember = useSelector(
    (state: RootState) => state.editProgramMemberData.programMember,
  );

  const followUpEmailStatus = useSelector(
    (state: RootState) => state.followUpEmail.followUpEmailStatus,
  );

  useEffect(() => {
    if (followUpEmailStatus.success) {
      setSelectedProgramMemberForSendingAFollowUpEmail(null);
      onCloseOutsideFollowUpModal();
    }
  }, [followUpEmailStatus]);

  useEffect(() => {
    if (outsideTriggerOpen) {
      setSelectedProgramMemberForSendingAFollowUpEmail(
        programMember?.id ? programMember : null,
      );
    } else {
      setSelectedProgramMemberForSendingAFollowUpEmail(null);
    }
  }, [outsideTriggerOpen]);

  const isReadOnly = programMember.status === programMemberStatusEnum.NotActive;

  let isFollowUpActionVisible = true;

  if (disabled) {
    isFollowUpActionVisible = false;
  }
  if (programMember.isOnboardingEmailSent) {
    isFollowUpActionVisible = false;
  } else if (programMember.status === programMemberStatusEnum.NotActive) {
    isFollowUpActionVisible = false;
  } else if (
    programMember.organizationTypeId === organizationTypesEnum.Company ||
    programMember.organizationTypeId === organizationTypesEnum.SME
  ) {
    if (programMember.organizationTypeId === organizationTypesEnum.SME) {
      if (!programMember.firstTestTimestamp) {
        isFollowUpActionVisible = false;
      }

      if (!programMember.area) {
        isFollowUpActionVisible = false;
      }
    }
    if (programMember.organizationTypeId === organizationTypesEnum.Company) {
      if (!programMember.supportPersonId) {
        isFollowUpActionVisible = false;
      }
    }

    // if (!programMember.organizationShortcutName) {
    //   isFollowUpActionVisible = false;
    // }
    // if (!programMember.epaadId) {
    //   isFollowUpActionVisible = false;
    // }
  } else if (programMember.organizationTypeId === organizationTypesEnum.CAMP) {
    // Do nothing, just to skip setting isFollowUpActionVisible to false;
  } else {
    isFollowUpActionVisible = false;
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedProgramMemberForSendingAFollowUpEmail(
            programMember?.id ? programMember : null,
          );
        }}
        disabled={isReadOnly || !isFollowUpActionVisible}>
        {t('common:Follow up')}
      </Button>
      {selectedProgramMemberForSendingAFollowUpEmail && (
        <SendFollowUpEmailModal
          programMember={selectedProgramMemberForSendingAFollowUpEmail}
          onClose={() => {
            setSelectedProgramMemberForSendingAFollowUpEmail(null);
          }}
          listOfContactPeople={programMember?.contacts || []}
        />
      )}
    </>
  );
};

export default FollowUpEmail;
