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
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Material UI
import { Tooltip, Typography } from '@material-ui/core';

// Custom components
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';
import ModalWrapper from 'components/Wrappers/ModalWrapper';

// Actions
import {
  clearUpdateProgramData,
  deactivateProgramMember,
  reActivateProgramMember,
} from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberSlice';

// Utils
import { RootState } from 'redux/combineReducers';
import programMemberStatusEnum from 'utils/programMemberStatusEnum';

// Routes
import { OnboardingAndTrainingAdministrationRoutes } from 'config/routes';

const DeactiveProgramMember: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { t } = useTranslation();

  const [showModal, setShowModal] = useState<string>('');

  const programMember = useSelector(
    (state: RootState) => state.editProgramMemberData.programMember,
  );

  const deactivateProgramMemberStatus = useSelector(
    (state: RootState) =>
      state.editProgramMemberData.deactivateProgramMemberStatus,
  );

  const reActivateProgramMemberStatus = useSelector(
    (state: RootState) =>
      state.editProgramMemberData.reActivateProgramMemberStatus,
  );

  useEffect(() => {
    if (
      deactivateProgramMemberStatus.success ||
      reActivateProgramMemberStatus.success
    ) {
      dispatch(clearUpdateProgramData());
      history.push(
        OnboardingAndTrainingAdministrationRoutes.overviewRoute.route,
      );
    }
  }, [deactivateProgramMemberStatus, reActivateProgramMemberStatus]);

  const onShowModal = (value: string) => {
    setShowModal(value);
  };

  const onDeactivate = () => {
    const data = {
      id: programMember.id,
      isActive: false,
    };
    dispatch(deactivateProgramMember(data));
  };

  const onReActivate = () => {
    const data = {
      id: programMember.id,
      isActive: true,
      status: programMemberStatusEnum.Onboarded,
    };
    dispatch(reActivateProgramMember(data));
  };

  const isNotActive =
    programMember.status === programMemberStatusEnum.NotActive;

  return (
    <>
      {isNotActive ? (
        <Tooltip title={`${t('common:Re-activate program member')}`}>
          <ButtonWithLoadingAnimation
            variant="contained"
            color="primary"
            isLoading={reActivateProgramMemberStatus.requesting}
            onClick={() => onShowModal('re-activate')}
            text={t('common:Re-activate')}
            backgroundColor="#9510AC"
            hoverBackgroundColor="#62007c"
            disabled={reActivateProgramMemberStatus.success}
          />
        </Tooltip>
      ) : (
        <Tooltip title={`${t('common:Deactivate program member')}`}>
          <ButtonWithLoadingAnimation
            variant="contained"
            color="primary"
            isLoading={deactivateProgramMemberStatus.requesting}
            onClick={() => onShowModal('deactivate')}
            text={t('common:Deactivate')}
            backgroundColor="#9510AC"
            hoverBackgroundColor="#62007c"
            disabled={deactivateProgramMemberStatus.success}
          />
        </Tooltip>
      )}

      {showModal === 're-activate' && (
        <ModalWrapper
          isOpen
          type="primary"
          title={t('modals:Re-activate this program member?')}
          loading={reActivateProgramMemberStatus.requesting}
          onCancel={(event: any) => {
            event.stopPropagation();
            setShowModal('');
          }}
          onOK={(event: any) => {
            event.stopPropagation();
            onReActivate();
          }}>
          <Typography variant="body2">
            {t(
              'modals:Are you sure you want to re-activate this program member?',
            )}
          </Typography>
        </ModalWrapper>
      )}
      {showModal === 'deactivate' && (
        <ModalWrapper
          isOpen
          type="primary"
          title={t('modals:Deactivate this program member?')}
          loading={deactivateProgramMemberStatus.requesting}
          onCancel={(event: any) => {
            event.stopPropagation();
            setShowModal('');
          }}
          onOK={(event: any) => {
            event.stopPropagation();
            onDeactivate();
          }}>
          <Typography variant="body2">
            {t(
              'modals:Are you sure you want to deactivate this program member?',
            )}
          </Typography>
        </ModalWrapper>
      )}
    </>
  );
};

export default DeactiveProgramMember;
