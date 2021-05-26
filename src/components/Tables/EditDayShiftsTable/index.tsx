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
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Material UI
import { Grid, Typography, IconButton } from '@material-ui/core';

// Material Icons
import { PersonAdd as PersonAddIcon } from '@material-ui/icons';

// Custom components
import RequiredPeopleOutOf from 'components/RequiredPeopleOutOf';
import withErrorHandler from 'components/Wrappers/ErrorBoundaryWrapper';
import ShiftTable from './ShiftTable';
import RemoveConfirmedEmployeeModal from 'components/Modals/RemoveConfirmedEmployeeModal';
import AddEmployeeToShiftModal from 'components/Modals/AddEmployeeToShiftModal';

// Types
import {
  CapacityOverviewShiftConfirmedEmployeeType,
  CapacityShiftType,
} from 'redux/globalState/capacity/types';

// Utils
import { RootState } from 'redux/combineReducers';
import IncreaseShiftCountButton from './IncreaseShiftCountButton';

interface IEditDayShiftsTableProps {
  isReadOnly?: boolean;
  forDate: string;
}

const EditDayShiftsTable: React.FC<IEditDayShiftsTableProps> = (
  props: IEditDayShiftsTableProps,
) => {
  const { isReadOnly, forDate } = props;
  const { t } = useTranslation();

  const [
    removeConfirmedEmployee,
    setRemoveConfirmedEmployee,
  ] = useState<CapacityOverviewShiftConfirmedEmployeeType | null>(null);

  const [
    removeFixedEmployee,
    setRemoveFixedEmployee,
  ] = useState<CapacityOverviewShiftConfirmedEmployeeType | null>(null);

  const [addEmployeeToShiftData, setAddEmployeeToShiftData] = useState<
    any | null
  >(null);

  const editDayData = useSelector(
    (state: RootState) => state.laboratoryAdministrationEditDay.editDayData,
  );

  const shiftOne =
    editDayData?.shifts?.length > 0 ? editDayData.shifts[0] : null;
  const shiftTwo =
    editDayData?.shifts?.length > 0 ? editDayData.shifts[1] : null;

  const onCloseRemoveConfirmedEmployeeModal = () => {
    setRemoveConfirmedEmployee(null);
  };

  const onCloseRemoveFixedEmployeeModal = () => {
    setRemoveFixedEmployee(null);
  };

  const onCloseAddEmployeeToShiftModal = () => {
    setAddEmployeeToShiftData(null);
  };

  const onOpenAddPersonToShift = (shift: CapacityShiftType) => {
    const data = {
      shift,
      forDate,
      shiftData: shift === 'First' ? shiftOne : shiftTwo,
      isInvitationSend: editDayData.invitationAlreadySent,
    };
    setAddEmployeeToShiftData(data);
  };

  let shiftOneIsFull = false;
  let shiftTwoIsFull = false;
  if (shiftOne) {
    shiftOneIsFull =
      shiftOne.confirmedNotCanceledEmployeesCount ===
      shiftOne.requiredPersonnelCountShift;
  }
  if (shiftTwo) {
    shiftTwoIsFull =
      shiftTwo.confirmedNotCanceledEmployeesCount ===
      shiftTwo.requiredPersonnelCountShift;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Grid className="pb-2" container justify="space-between">
              <Grid item>
                <Typography variant="h6">{t('common:Morning')}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <RequiredPeopleOutOf
                  current={shiftOne?.confirmedNotCanceledEmployeesCount || 0}
                  max={shiftOne?.requiredPersonnelCountShift || 0}
                />
              </Grid>
              <Grid item>
                <IncreaseShiftCountButton
                  color="secondary"
                  disabled={!editDayData.invitationAlreadySent}
                  invitationId={editDayData.invitationId}
                  shift="First"
                />
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="expand"
                  color="secondary"
                  disabled={
                    shiftOneIsFull || !editDayData.invitationAlreadySent
                  }
                  onClick={() => onOpenAddPersonToShift('First')}>
                  <PersonAddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <ShiftTable
              isReadOnly={isReadOnly}
              shiftData={shiftOne}
              onSetRemoveConfirmedEmployee={setRemoveConfirmedEmployee}
              onSetRemoveFixedEmployee={setRemoveFixedEmployee}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Grid className="pb-2" container justify="space-between">
              <Grid item>
                <Typography variant="h6">{t('common:Afternoon')}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <RequiredPeopleOutOf
                  current={shiftTwo?.confirmedNotCanceledEmployeesCount || 0}
                  max={shiftTwo?.requiredPersonnelCountShift || 0}
                />
              </Grid>
              <Grid item>
                <IncreaseShiftCountButton
                  color="secondary"
                  disabled={!editDayData.invitationAlreadySent}
                  invitationId={editDayData.invitationId}
                  shift="Second"
                />
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="expand"
                  color="secondary"
                  disabled={
                    shiftTwoIsFull || !editDayData.invitationAlreadySent
                  }
                  onClick={() => onOpenAddPersonToShift('Second')}>
                  <PersonAddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <ShiftTable
              isReadOnly={isReadOnly}
              shiftData={shiftTwo}
              onSetRemoveConfirmedEmployee={setRemoveConfirmedEmployee}
              onSetRemoveFixedEmployee={setRemoveFixedEmployee}
            />
          </Grid>
        </Grid>
      </Grid>
      {removeConfirmedEmployee && (
        <RemoveConfirmedEmployeeModal
          onClose={onCloseRemoveConfirmedEmployeeModal}
          removePersonData={removeConfirmedEmployee}
          forDate={forDate}
        />
      )}
      {removeFixedEmployee && (
        <RemoveConfirmedEmployeeModal
          onClose={onCloseRemoveFixedEmployeeModal}
          removePersonData={removeFixedEmployee}
          forDate={forDate}
          isFixed
        />
      )}
      {addEmployeeToShiftData && (
        <AddEmployeeToShiftModal
          onClose={onCloseAddEmployeeToShiftModal}
          data={addEmployeeToShiftData}
        />
      )}
    </Grid>
  );
};

export default withErrorHandler(EditDayShiftsTable);
