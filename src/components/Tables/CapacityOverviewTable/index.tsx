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
import { Link } from 'react-router-dom';

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
  Tooltip,
  IconButton,
} from '@material-ui/core';

// Material Icons
import {
  Edit as EditIcon,
  MailOutline as MailOutlineIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Replay as ReplayIcon,
} from '@material-ui/icons';

// Custom components
import RequiredPeopleIndicator from 'components/RequiredPeopleIndicator';
import LoadingSwapComponent from 'components/loaders/LoadingSwapComponent';
import StudentInviteModal from 'components/Modals/StudentsInviteModal';
import withErrorHandler from 'components/Wrappers/ErrorBoundaryWrapper';

// Actions
import { getCapacityOverview } from 'redux/globalState/capacity/capacitySlice';

// Types
import {
  CapacityOverviewType,
  CapacityOverviewShiftType,
  GetCapacityOverviewRequestType,
} from 'redux/globalState/capacity/types';

// Utils
import { RootState } from 'redux/combineReducers';
import {
  formatDateToMonthSlashDaySlashFullYear,
  getDayName,
  formatDateToFullYearDashMonthDashDay,
  getWeekNumber,
  checkDateAndConvert,
  subtractDays,
} from 'utils/dateFNSCustom';
import separateNumberWithCommas from 'utils/separateNumberWithCommas';

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

  const isEarliestDate = useSelector(
    (state: RootState) => state.capacity.isEarliestDate,
  );

  const initialDispatch = (params?: GetCapacityOverviewRequestType) => {
    dispatch(getCapacityOverview(params));
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

  const onRefreshTableData = () => {
    initialDispatch();
  };

  const onGoBackFiveDays = () => {
    const earliestDate = capacityOverviewData[0].date;
    if (earliestDate) {
      const parsedDate = checkDateAndConvert(earliestDate);
      if (parsedDate) {
        const params: GetCapacityOverviewRequestType = {
          startDate: formatDateToFullYearDashMonthDashDay(
            subtractDays(parsedDate, 7),
          ),
        };
        initialDispatch(params);
      }
    }
  };

  let color = 0;
  let currentWeekNumber = 0;

  const tableHeaders = capacityOverviewData?.map(
    (item: CapacityOverviewType) => {
      const weekNumber = getWeekNumber(item.date);
      if (currentWeekNumber !== weekNumber) {
        currentWeekNumber = weekNumber;
        if (color === 0) {
          color = 1;
        } else {
          color = 0;
        }
      }

      const element = (
        <div key={item.date}>
          <Grid container wrap="nowrap" justify="flex-start">
            <Grid item>
              <Tooltip
                title={`${t('common:Edit')}`}
                key={item.date}
                enterDelay={300}>
                <span>
                  <Link
                    to={{
                      pathname: `/laboratory/edit-day/${formatDateToFullYearDashMonthDashDay(
                        item.date,
                      )}`,
                    }}>
                    <IconButton color="primary" size="small">
                      <EditIcon style={{ fontSize: 20 }} />
                    </IconButton>
                  </Link>
                </span>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip
                title={
                  item.invitationAlreadySent
                    ? `${t('common:Invitation already sent')}`
                    : `${t('common:Send invitation')}`
                }
                key={item.date}
                enterDelay={300}>
                <span>
                  <IconButton
                    color="primary"
                    disabled={item.invitationAlreadySent}
                    size="small"
                    onClick={() => onSendInvitation(item.date)}>
                    <MailOutlineIcon style={{ fontSize: 20 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
      );

      return {
        day: getDayName(item.date),
        date: formatDateToMonthSlashDaySlashFullYear(item.date),
        color,
        element,
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

  const convertShiftsData = (
    shift: CapacityOverviewShiftType,
    invitationAlreadySent: boolean,
  ) => {
    const fixedNonCanceledFixedEmployeesCount = shift.fixedEmployees.reduce<number>(
      (peopleCount, item) => {
        if (!item.isCanceled) {
          return peopleCount + 1;
        }
        return peopleCount;
      },
      0,
    );
    const requiredNumberOfPeople = (
      <RequiredPeopleIndicator
        invitationAlreadySent={invitationAlreadySent}
        current={shift.confirmedNotCanceledEmployeesCount}
        max={shift.requiredPersonnelCountShift}
        total={
          shift.confirmedNotCanceledEmployeesCount +
            fixedNonCanceledFixedEmployeesCount || 0
        }
      />
    );

    let employeeNames;
    if (
      shift?.confirmedEmployees?.length !== 0 ||
      shift?.fixedEmployees?.length !== 0
    ) {
      employeeNames = (
        <Grid container spacing={1} className="pt-4">
          {shift.confirmedEmployees.map((employee: any) => {
            return (
              <Grid key={employee.email} item xs={12}>
                <Typography
                  noWrap
                  variant="body2"
                  className={`font-size-tiny ${
                    employee.isCanceled && 'strike-through'
                  }`}>{`${employee.firstName} ${employee.lastName}`}</Typography>
              </Grid>
            );
          })}
          {shift.fixedEmployees.map((employee: any) => {
            return (
              <Grid key={employee.email} item xs={12}>
                <Typography
                  noWrap
                  variant="body2"
                  className={`font-size-tiny color-gray ${
                    employee.isCanceled && 'strike-through'
                  }`}>{`${employee.firstName} ${employee.lastName}`}</Typography>
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
              element: separateNumberWithCommas(item.samples),
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
  }

  let text = '';
  if (capacityViewStatus.requesting) {
    text = t('progressMessages:Loading capacity view data');
  }

  return (
    <>
      <LoadingSwapComponent
        isLoading={capacityViewStatus.requesting}
        center
        text={text}>
        <Paper>
          <TableContainer>
            <Table stickyHeader aria-label="capacity-overview">
              <TableHead className="table-header-shadow">
                <TableRow>
                  <TableCell>
                    <div>
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        wrap="nowrap"
                        spacing={2}>
                        <Grid item>
                          <IconButton
                            color="primary"
                            size="small"
                            disabled={isEarliestDate}
                            onClick={onGoBackFiveDays}>
                            <ArrowForwardIosIcon
                              style={{
                                fontSize: 30,
                                transform: 'translateX(-2px) rotate(180deg)',
                              }}
                            />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={onRefreshTableData}>
                            <ReplayIcon style={{ fontSize: 30 }} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </div>
                  </TableCell>
                  {tableHeaders.map((header: any) => (
                    <TableCell
                      key={header.date}
                      className={`capacity-table-header-color-${header.color}`}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography className="header-font-size-small">
                            {header.day}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography className="header-font-size-small">
                            {header.date}
                          </Typography>
                        </Grid>
                        {isLaboratory && (
                          <Grid item xs={12} className="pt-2">
                            {header.element}
                          </Grid>
                        )}
                      </Grid>
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
