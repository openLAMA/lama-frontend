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
import { useTranslation } from 'react-i18next';

// Material UI
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@material-ui/core';

// Material Icons
import { DeleteOutline as DeleteOutlineIcon } from '@material-ui/icons';

// Custom components
import withErrorHandler from 'components/Wrappers/ErrorBoundaryWrapper';
import NoResultsFound from 'components/Tables/NoResultsFound';

// Types
import {
  CapacityOverviewShiftConfirmedEmployeeType,
  CapacityOverviewShiftType,
} from 'redux/globalState/capacity/types';

interface IShiftTableProps {
  isReadOnly?: boolean;
  shiftData: CapacityOverviewShiftType | null;
  onSetRemoveConfirmedEmployee: (
    item: CapacityOverviewShiftConfirmedEmployeeType,
  ) => void;
  onSetRemoveFixedEmployee: (
    item: CapacityOverviewShiftConfirmedEmployeeType,
  ) => void;
}

const ShiftTable: React.FC<IShiftTableProps> = (props: IShiftTableProps) => {
  const {
    isReadOnly,
    shiftData,
    onSetRemoveConfirmedEmployee,
    onSetRemoveFixedEmployee,
  } = props;
  const { t } = useTranslation();

  const tableHeaders = [
    {
      headName: 'name',
      title: 'Name',
    },
    {
      headName: 'status',
      title: 'Status',
    },
    {
      headName: 'fixedEmployee',
      title: 'Fixed employee',
    },
    {
      headName: 'actions',
      title: 'Actions',
    },
  ];

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader aria-label="capacity-overview">
          <TableHead className="table-header-shadow">
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell key={index}>
                  <Typography>{t(`common:${header.title}`)}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {shiftData?.fixedEmployees?.map(
              (item: CapacityOverviewShiftConfirmedEmployeeType) => (
                <TableRow key={item.email}>
                  <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
                  <TableCell>
                    {item.isCanceled
                      ? t('common:Removed')
                      : t('common:Accepted')}
                  </TableCell>
                  <TableCell>{t('common:Yes')}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        onSetRemoveFixedEmployee(item);
                      }}
                      disabled={isReadOnly || item.isCanceled}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
            )}
            {shiftData?.confirmedEmployees?.map(
              (item: CapacityOverviewShiftConfirmedEmployeeType) => (
                <TableRow key={item.email}>
                  <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
                  <TableCell>
                    {item.isCanceled
                      ? t('common:Removed')
                      : t('common:Accepted')}
                  </TableCell>
                  <TableCell>{t('common:No')}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        onSetRemoveConfirmedEmployee(item);
                      }}
                      disabled={isReadOnly || item.isCanceled}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {(shiftData &&
        shiftData.fixedEmployees &&
        shiftData.fixedEmployees.length > 0) ||
      (shiftData &&
        shiftData.confirmedEmployees &&
        shiftData.confirmedEmployees.length > 0) ? null : (
        <NoResultsFound />
      )}
    </Paper>
  );
};

export default withErrorHandler(ShiftTable);
