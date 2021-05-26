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
  removeConfirmedPerson,
  clearDeleteLaboratoryTestingPerson,
} from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/laboratoryAdministrationEditDaySlice';

// Types
import { CapacityOverviewShiftConfirmedEmployeeType } from 'redux/globalState/capacity/types';
import { RemoveLaboratoryAdministrationConfirmedPersonRequestType } from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/types';

// Utils
import { RootState } from 'redux/combineReducers';

interface IRemoveConfirmedEmployeeModalProps {
  onClose: () => void;
  removePersonData: CapacityOverviewShiftConfirmedEmployeeType;
  forDate: string;
  isFixed?: boolean;
}

const RemoveConfirmedEmployeeModal: React.FC<IRemoveConfirmedEmployeeModalProps> = (
  props: IRemoveConfirmedEmployeeModalProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { onClose, removePersonData, forDate, isFixed } = props;

  const loggedInUserId = useSelector(
    (state: RootState) => state.authData.userId,
  );

  const removeConfirmedPersonStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.removeConfirmedPersonStatus,
  );

  useEffect(() => {
    if (removeConfirmedPersonStatus.success) {
      dispatch(clearDeleteLaboratoryTestingPerson());
      onClose();
    }
  }, [removeConfirmedPersonStatus]);

  const onRemove = () => {
    const data: RemoveLaboratoryAdministrationConfirmedPersonRequestType = {
      email: removePersonData.email,
      date: forDate,
      canceledByUserId: loggedInUserId,
    };
    if (isFixed) {
      dispatch(removeConfirmedPerson(data, isFixed));
    } else {
      dispatch(removeConfirmedPerson(data));
    }
  };

  const username = `${removePersonData?.firstName} ${removePersonData?.lastName}`;

  return (
    <ModalWrapper
      isOpen
      type="primary"
      title={t('modals:Are you sure you want to remove this person?')}
      loading={removeConfirmedPersonStatus.requesting}
      onCancel={(event: any) => {
        event.stopPropagation();
        onClose();
      }}
      onDelete={(event: any) => {
        event.stopPropagation();
        onRemove();
      }}>
      <Typography variant="body2">
        {t('modals:Remove X from this date', { username: username })}
      </Typography>
    </ModalWrapper>
  );
};

export default RemoveConfirmedEmployeeModal;
