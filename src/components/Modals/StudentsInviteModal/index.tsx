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
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

// Material UI
import { Grid } from '@material-ui/core';

// Custom components
import ModalWrapper from 'components/Wrappers/ModalWrapper';
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import NumberControllerInput from 'components/FormControllerInputs/NumberControlInput';

// Actions
import { inviteLaboratoryCapacityStudents } from 'redux/laboratoryAdministration/laboratoryAdministrationDashboard/laboratoryAdministrationDashboardSlice';

// Types
import { SendInvitationForTestingPeopleType } from 'redux/laboratoryAdministration/laboratoryAdministrationDashboard/types';

// Utils
import { RootState } from 'redux/combineReducers';

interface IStudentInviteModalProps {
  onClose: () => void;
  onSuccess: () => void;
  forDate: string;
}

const StudentInviteModal: React.FC<IStudentInviteModalProps> = (
  props: IStudentInviteModalProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { onClose, onSuccess, forDate } = props;

  const loggedInUserId = useSelector(
    (state: RootState) => state.authData.userId,
  );

  const inviteLaboratoryCapacityStudentsStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationDashboardData
        .inviteLaboratoryCapacityStudentsStatus,
  );

  const { control, handleSubmit, errors } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      requiredPersonnelCountShift1: 0,
      requiredPersonnelCountShift2: 0,
    },
  });

  useEffect(() => {
    if (inviteLaboratoryCapacityStudentsStatus.success) {
      onSuccess();
      onClose();
    }
  }, [inviteLaboratoryCapacityStudentsStatus]);

  const onSubmitInvitation = (values: any) => {
    const data: SendInvitationForTestingPeopleType = {
      sendByUserId: loggedInUserId,
      date: forDate,
      requiredPersonnelCountShift1: values.requiredPersonnelCountShift1 || 0,
      requiredPersonnelCountShift2: values.requiredPersonnelCountShift2 || 0,
    };
    dispatch(inviteLaboratoryCapacityStudents(data));
  };

  return (
    <ModalWrapper
      isOpen
      type="primary"
      title={t('modals:Number of people for the day!')}
      loading={inviteLaboratoryCapacityStudentsStatus.requesting}
      onCancel={(event: any) => {
        event.stopPropagation();
        onClose();
      }}
      onOK={(event: any) => {
        event.stopPropagation();
        handleSubmit(onSubmitInvitation)();
      }}>
      <BasicFormWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <NumberControllerInput
              control={control}
              name="requiredPersonnelCountShift1"
              fieldRequired
              numberMustBePositive
              label={t('common:Morning')}
              id="morning"
              error={Boolean(errors?.requiredPersonnelCountShift1?.message)}
              errorMessage={errors?.requiredPersonnelCountShift1?.message}
              disabled={inviteLaboratoryCapacityStudentsStatus.requesting}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <NumberControllerInput
              control={control}
              name="requiredPersonnelCountShift2"
              fieldRequired
              numberMustBePositive
              label={t('common:Afternoon')}
              id="afternoon"
              error={Boolean(errors?.requiredPersonnelCountShift2?.message)}
              errorMessage={errors?.requiredPersonnelCountShift2?.message}
              disabled={inviteLaboratoryCapacityStudentsStatus.requesting}
            />
          </Grid>
        </Grid>
      </BasicFormWrapper>
    </ModalWrapper>
  );
};

export default StudentInviteModal;
