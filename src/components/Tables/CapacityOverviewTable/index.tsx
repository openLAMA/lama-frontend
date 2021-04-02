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

import React, { useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// Material UI
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Tooltip,
} from '@material-ui/core';

// Custom components
import CircleNumber from 'components/RequiredPeopleIndicator';
import LoadingSwapComponent from 'components/loaders/LoadingSwapComponent';
import StudentInviteModal from 'components/Modals/StudentsInviteModal';
import withErrorHandler from 'components/Wrappers/ErrorBoundaryWrapper';

// Actions
import { getCapacityOverview } from 'redux/globalState/capacity/capacitySlice';

// Utils
import {
  formatDateToMonthSlashDaySlashFullYear,
  getDayName,
} from 'utils/dateFNSCustom';

// Types
import { CapacityOverviewType } from 'redux/globalState/capacity/types';

// Utils
import { RootState } from 'redux/combineReducers';

interface ICapacityOverviewTableProps {
  isLaboratory?: boolean;
}

const CapacityOverviewTable: React.FC<ICapacityOverviewTableProps> = (
  props: ICapacityOverviewTableProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLaboratory } = props;

  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteForDate, setInviteForDate] = useState<string>('');

  const capacityViewStatus = useSelector(
    (state: RootState) => state.capacity.capacityOverviewStatus,
  );

  const capacityOverviewData = useSelector(
    (state: RootState) => state.capacity.capacityOverview,
  );

  const initialDispatch = () => {
    dispatch(getCapacityOverview());
  };

  useLayoutEffect(() => {
    initialDispatch();
  }, []);

  const onSendInvitation = (date: string) => {
    setShowInviteModal(true);
    setInviteForDate(date);
  };

  const onCloseInvitationModal = () => {
    setShowInviteModal(false);
    setInviteForDate('');
  };

  const onSuccessInvitationModal = () => {
    initialDispatch();
  };

  const tableHeaders = capacityOverviewData?.map(
    (item: CapacityOverviewType) => {
      return {
        day: getDayName(item.date),
        date: formatDateToMonthSlashDaySlashFullYear(item.date),
      };
    },
  );

  // Needed because of the typescript loosing types inside maps.
  type tableDataType = {
    id: string | number;
    tableData: {
      key: string | number;
      element: React.ReactNode;
    }[];
  };

  const convertShiftsData = (shift: any, invitationAlreadySent: boolean) => {
    let requiredNumberOfPeople;
    if (invitationAlreadySent) {
      requiredNumberOfPeople = (
        <CircleNumber number={shift.requiredPersonnelCountShift} />
      );
    }
    let employeeNames;
    if (shift?.confirmedEmployees?.length !== 0) {
      employeeNames = (
        <Grid container spacing={1}>
          {shift.confirmedEmployees.map((employee: any) => {
            return (
              <Grid key={employee.email} item xs={12}>
                <Typography
                  noWrap
                  variant="body2"
                  className="font-size-tiny">{`${employee.firstName} ${employee.lastName}`}</Typography>
              </Grid>
            );
          })}
        </Grid>
      );
    } else {
      employeeNames = (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography>-</Typography>
          </Grid>
        </Grid>
      );
    }

    return [
      {
        key: uuidv4(),
        element: (
          <div>
            {requiredNumberOfPeople}
            {employeeNames}
          </div>
        ),
      },
    ];
  };

  // Use for mapping
  const tableData = [];

  tableData.push({
    id: '1',
    text: t('common:Daily test samples'),
    data: capacityOverviewData?.map(
      (item: CapacityOverviewType): tableDataType => {
        return {
          id: item.date,
          tableData: [
            {
              key: item.date,
              element: item.samples,
            },
          ],
        };
      },
    ),
  });

  if (isLaboratory) {
    tableData.push({
      id: '2',
      text: t('common:Morning shift'),
      data: capacityOverviewData?.map(
        (item: CapacityOverviewType): tableDataType => {
          return {
            id: item.date,
            tableData: item?.shifts[0]
              ? convertShiftsData(item.shifts[0], item.invitationAlreadySent)
              : [
                  {
                    key: item.date,
                    element: <Typography key={item.date}>-</Typography>,
                  },
                ],
          };
        },
      ),
    });
    tableData.push({
      id: '3',
      text: t('common:Afternoon shift'),
      data: capacityOverviewData?.map(
        (item: CapacityOverviewType): tableDataType => {
          return {
            id: item.date,
            tableData: item?.shifts[1]
              ? convertShiftsData(item.shifts[1], item.invitationAlreadySent)
              : [
                  {
                    key: item.date,
                    element: <Typography key={item.date}>-</Typography>,
                  },
                ],
          };
        },
      ),
    });
    tableData.push({
      id: '4',
      text: t('common:Actions'),
      data: capacityOverviewData?.map(
        (item: CapacityOverviewType): tableDataType => {
          return {
            id: item.date,
            tableData: [
              {
                key: item.date,
                element: (
                  <Tooltip
                    title={
                      item.invitationAlreadySent
                        ? `${t('common:Invitation already sent')}`
                        : `${t('common:Send invitation')}`
                    }
                    key={item.date}
                    enterDelay={300}>
                    <span>
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={() => onSendInvitation(item.date)}
                        disabled={item.invitationAlreadySent}>
                        {t('common:Invite')}
                      </Button>
                    </span>
                  </Tooltip>
                ),
              },
            ],
          };
        },
      ),
    });
  }

  let text = '';
  if (capacityViewStatus.requesting) {
    text = t('progressMessages:Loading capacity view data');
  }

  return (
    <>
      <LoadingSwapComponent
        isLoading={capacityViewStatus.requesting}
        withGrid
        text={text}>
        <Paper>
          <TableContainer>
            <Table stickyHeader aria-label="capacity-overview">
              <TableHead className="table-header-shadow">
                <TableRow>
                  <TableCell></TableCell>
                  {tableHeaders.map((header: any) => (
                    <TableCell key={header.date}>
                      <Typography>{header.day}</Typography>
                      <Typography>{header.date}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.text}</TableCell>
                    {item?.data?.map((d: tableDataType) => {
                      return (
                        <TableCell key={d.id} className="relative">
                          {d.tableData.map((elem) => {
                            return elem.element;
                          })}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </LoadingSwapComponent>
      {showInviteModal && (
        <StudentInviteModal
          onClose={onCloseInvitationModal}
          onSuccess={onSuccessInvitationModal}
          forDate={inviteForDate}
        />
      )}
    </>
  );
};

export default withErrorHandler(CapacityOverviewTable);
