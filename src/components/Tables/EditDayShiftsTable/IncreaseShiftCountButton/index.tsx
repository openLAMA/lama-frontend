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

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Material UI
import { IconButton } from '@material-ui/core';

// Material Icons
import { ExposurePlus1Rounded as ExposurePlus1RoundedIcon } from '@material-ui/icons';

// Custom components
import CircularLoading from 'components/loaders/CircularLoading';
import withErrorHandler from 'components/Wrappers/ErrorBoundaryWrapper';

// Actions
import { increaseShiftCountForDayLaboratoryAdministrationShift } from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/laboratoryAdministrationEditDaySlice';

// Types
import { CapacityShiftType } from 'redux/globalState/capacity/types';

// Utils
import { RootState } from 'redux/combineReducers';

interface IIncreaseShiftCountButtonProps {
  disabled?: boolean;
  shift: CapacityShiftType;
  color: 'primary' | 'secondary';
  invitationId: string;
}

const IncreaseShiftCountButton: React.FC<IIncreaseShiftCountButtonProps> = (
  props: IIncreaseShiftCountButtonProps,
) => {
  const { disabled, shift, color, invitationId } = props;
  const dispatch = useDispatch();

  const increaseShiftCountForDayStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.increaseShiftCountForDayStatus,
  );

  const onIncreaseShiftCounter = () => {
    const data = {
      shiftNumber: shift,
      invitationId,
    };
    dispatch(increaseShiftCountForDayLaboratoryAdministrationShift(data));
  };

  return (
    <IconButton
      aria-label="expand"
      color={color}
      disabled={disabled || increaseShiftCountForDayStatus.requesting}
      onClick={onIncreaseShiftCounter}>
      {increaseShiftCountForDayStatus.requesting ? (
        <div style={{ width: 24, height: 24 }}>
          <CircularLoading size={16} />
        </div>
      ) : (
        <ExposurePlus1RoundedIcon />
      )}
    </IconButton>
  );
};

export default withErrorHandler(IncreaseShiftCountButton);
