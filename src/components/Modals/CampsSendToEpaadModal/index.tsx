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

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

// Material UI
import { Typography } from '@material-ui/core';

// Custom components
import ModalWrapper from 'components/Wrappers/ModalWrapper';

// Types
import { CampSendEmailEpaadRequestType } from 'redux/onboardingAndTrainingAdministration/EditProgramMember/types';

// Actions
import {
  campSendEmailEpaad,
  clearCampSendEmailEpaadStats,
} from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberSlice';

// Utils
import { RootState } from 'redux/combineReducers';

interface ICampsSendToEpaadModalProps {
  onClose: () => void;
  programMemberId: string;
}

const CampsSendToEpaadModal: React.FC<ICampsSendToEpaadModalProps> = (
  props: ICampsSendToEpaadModalProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { onClose, programMemberId } = props;

  const campSendEmailEpaadStatus = useSelector(
    (state: RootState) => state.editProgramMemberData.campSendEmailEpaadStatus,
  );

  useEffect(() => {
    return () => {
      dispatch(clearCampSendEmailEpaadStats());
    };
  }, []);

  useEffect(() => {
    if (campSendEmailEpaadStatus.success) {
      onClose();
    }
  }, [campSendEmailEpaadStatus]);

  const onSend = () => {
    const data: CampSendEmailEpaadRequestType = {
      organizationId: programMemberId,
      receivers: [process.env.REACT_APP_CC_RECEIVER],
    };
    dispatch(campSendEmailEpaad(data));
  };

  return (
    <ModalWrapper
      isOpen
      type="primary"
      title={t('modals:Epaad onboarding date', {
        email: process.env.REACT_APP_CC_RECEIVER,
      })}
      loading={campSendEmailEpaadStatus.requesting}
      onCancel={(event: any) => {
        event.stopPropagation();
        onClose();
      }}
      onSend={(event: any) => {
        event.stopPropagation();
        onSend();
      }}>
      <Typography variant="body2">
        {t('modals:Are you sure you want to send this organization data to?')}
      </Typography>
      <Typography variant="body2">
        {process.env.REACT_APP_CC_RECEIVER}
      </Typography>
    </ModalWrapper>
  );
};

export default CampsSendToEpaadModal;
