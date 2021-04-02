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

// Actions
import {
  deleteLaboratoryTestingPerson,
  clearLaboratoryTestingPersonFlags,
} from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/organizationAdministrationTestingPersonalSlice';

// Utils
import { RootState } from 'redux/combineReducers';

interface IDeleteTestingPersonalModalProps {
  onClose: () => void;
  onSuccess: () => void;
  deleteData?: any;
}

const DeleteTestingPersonalModal: React.FC<IDeleteTestingPersonalModalProps> = (
  props: IDeleteTestingPersonalModalProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { onClose, onSuccess, deleteData } = props;

  const deleteLaboratoryTestingPersonStatus = useSelector(
    (state: RootState) =>
      state.laboratoryTestingPersonalData.deleteLaboratoryTestingPersonStatus,
  );

  useEffect(() => {
    if (deleteLaboratoryTestingPersonStatus.success) {
      dispatch(clearLaboratoryTestingPersonFlags());
      onSuccess();
      onClose();
    }
  }, [deleteLaboratoryTestingPersonStatus]);

  const onDelete = () => {
    dispatch(deleteLaboratoryTestingPerson(deleteData.id));
  };

  return (
    <ModalWrapper
      isOpen
      type="primary"
      title={t('modals:Are you sure you want to delete this person?')}
      loading={deleteLaboratoryTestingPersonStatus.requesting}
      onCancel={(event: any) => {
        event.stopPropagation();
        onClose();
      }}
      onDelete={(event: any) => {
        event.stopPropagation();
        onDelete();
      }}>
      <Typography variant="body2">{`${deleteData?.firstName} ${deleteData?.lastName}`}</Typography>
    </ModalWrapper>
  );
};

export default DeleteTestingPersonalModal;
