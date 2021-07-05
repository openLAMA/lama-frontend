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
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// Material UI
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Grid,
  Tooltip,
} from '@material-ui/core';

// Material Icons
import {
  EditOutlined as EditOutlineIcon,
  AddCommentOutlined as AddCommentOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
} from '@material-ui/icons';

// Custom components
import StatusIndicator from 'components/StatusIndicator';
import LoadingAnimationOverlay from 'components/loaders/LoadingAnimationOverlay';
import TableEnhancers from 'components/TableEnhancers';
import withErrorHandler from 'components/Wrappers/ErrorBoundaryWrapper';
import NoResultsFound from '../NoResultsFound';

// Actions
import { setFilter } from 'redux/globalState/programMembers/programMembersSlice';

// Utils
import { RootState } from 'redux/combineReducers';
import { findCity } from 'utils/findCity';
import {
  formatDateToMonthDotDayDotFullYear,
  getDayName,
} from 'utils/dateFNSCustom';
import programMemberStatusEnum from 'utils/programMemberStatusEnum';
import organizationTypesEnum from 'utils/organizationTypesEnum';

// Types
import {
  ProgramMemberFilterType,
  ProgramMemberType,
} from 'redux/globalState/programMembers/types';
import ContractReceivedModal from 'components/Modals/ContractReceivedModal';

interface IProgramMembersTableProps {
  data: ProgramMemberType[];
  showEditButton?: boolean;
  tableHeightOffset: number;
  tableWidthOffset: number;
}

const ProgramMembersTable: React.FC<IProgramMembersTableProps> = (
  props: IProgramMembersTableProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data, showEditButton, tableHeightOffset, tableWidthOffset } = props;

  const isDrawerOpen = useSelector(
    (state: RootState) => state.navDrawer.isDrawerOpen,
  );

  const filter = useSelector(
    (state: RootState) => state.programMembersData.filter,
  );

  const setNewFilter = (filter: ProgramMemberFilterType) => {
    dispatch(setFilter(filter));
  };

  const programMembersStatus = useSelector(
    (state: RootState) => state.programMembersData.programMembersStatus,
  );

  const citiesStatus = useSelector(
    (state: RootState) => state.cities.citiesStatus,
  );

  const citiesList = useSelector((state: RootState) => state.cities.cities);

  const handleRequestSort = (event: any, property: string) => {
    const newFilter: ProgramMemberFilterType = { ...filter };
    if (filter.order === 'desc' && filter.orderBy === property) {
      newFilter.order = 'asc';
    } else if (filter.order === 'asc' && filter.orderBy === property) {
      newFilter.order = 'desc';
    }
    newFilter.orderBy = property;
    setNewFilter(newFilter);
  };

  const [
    showContractReceivedModal,
    setShowContractReceivedModal,
  ] = useState<ProgramMemberType | null>(null);

  const onOpenContractReceivedModal = (data: ProgramMemberType) => {
    setShowContractReceivedModal(data);
  };

  const onCloseContractReceivedModal = () => {
    setShowContractReceivedModal(null);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          style={{
            overflowX: 'auto',
          }}>
          <Grid container direction="column">
            <Grid item xs={12} className="relative">
              <LoadingAnimationOverlay
                isLoading={
                  citiesStatus.requesting || programMembersStatus.requesting
                }
              />
              <Paper>
                <TableContainer
                  style={{
                    maxHeight: `calc(100vh - ${tableHeightOffset}px`,
                    maxWidth: `calc(100vw - ${tableWidthOffset}px ${
                      isDrawerOpen ? '' : '+ 250px'
                    }`,
                    overflowY: 'auto',
                    transition: 'max-width 0.2s ease-in-out',
                  }}>
                  <Table stickyHeader aria-label="capacity-overview">
                    <TableEnhancers.EnhancedTableHead
                      order={filter.order}
                      orderBy={filter.orderBy}
                      onRequestSort={handleRequestSort}
                      headCells={[
                        {
                          id: 'actions',
                          label: t('common:Actions'),
                          hide: !showEditButton,
                        },
                        { id: 'type', label: t('common:Type') },
                        {
                          id: 'status',
                          label: t('common:Status'),
                          sortable: true,
                        },
                        {
                          id: 'followUpStatus',
                          label: t('common:Follow up'),
                        },
                        {
                          id: 'epaadstatus',
                          label: t('common:Epaad Status'),
                        },
                        {
                          id: 'supportPerson',
                          label: t('common:Support person'),
                          sortable: true,
                        },
                        {
                          id: 'createdOn',
                          label: t('common:Created on date'),
                          sortable: true,
                        },
                        {
                          id: 'name',
                          label: t('common:Name of the organization'),
                          sortable: true,
                        },
                        {
                          id: 'organizationShortcutName',
                          label: t('common:Organization key'),
                        },
                        {
                          id: 'numberOfSamples',
                          label: t('common:Total people'),
                          sortable: true,
                        },
                        {
                          id: 'registeredEmployees',
                          label: t('common:Number of registered employees'),
                          sortable: true,
                        },
                        {
                          id: 'contactPerson',
                          label: t('common:Contact person'),
                        },
                        { id: 'email', label: t('common:Email') },
                        {
                          id: 'phone',
                          label: t('common:Mobile phone number'),
                        },
                        {
                          id: 'trainingTimestamp',
                          label: t('common:Information event date'),
                          sortable: true,
                        },
                        {
                          id: 'onboardingTimestamp',
                          label: t('common:Onboarding date'),
                        },
                        {
                          id: 'firstTestTimestamp',
                          label: t('common:Starting date'),
                          sortable: true,
                        },
                        {
                          id: 'testingDay',
                          label: t('common:Testing day'),
                        },
                        {
                          id: 'area',
                          label: t('common:Area'),
                          sortable: true,
                        },
                        {
                          id: 'address',
                          label: t('common:Street'),
                          sortable: true,
                        },
                        {
                          id: 'zip',
                          label: t('common:ZIP code'),
                          sortable: true,
                        },
                        { id: 'city', label: t('common:City') },
                        {
                          id: 'schoolType',
                          label: t('common:School type'),
                          sortable: true,
                        },
                        { id: 'manager', label: t('common:Manager') },
                      ]}
                    />

                    <TableBody>
                      {data.map((item: ProgramMemberType) => {
                        const isFollowUpActionVisible =
                          (item.organizationTypeId ===
                            organizationTypesEnum.Company ||
                            item.organizationTypeId ===
                              organizationTypesEnum.SME) &&
                          !item.isOnboardingEmailSent &&
                          item.status !== programMemberStatusEnum.NotActive;

                        let followUpStatus:
                          | 'grayed'
                          | 'information'
                          | 'success'
                          | 'failure' = 'grayed';
                        if (item.isOnboardingEmailSent) {
                          followUpStatus = 'success';
                        }

                        return (
                          <TableRow key={item.id}>
                            {showEditButton && (
                              <TableCell>
                                <Grid container wrap="nowrap" spacing={1}>
                                  <Grid item>
                                    <Link
                                      to={{
                                        pathname: `/university/edit-program-member/${item.id}`,
                                      }}>
                                      <IconButton color="primary" size="small">
                                        <EditOutlineIcon />
                                      </IconButton>
                                    </Link>
                                  </Grid>
                                  <Grid item>
                                    {isFollowUpActionVisible ? (
                                      <Link
                                        to={{
                                          pathname: `/university/edit-program-member/${item.id}`,
                                          state: {
                                            openFollowUpModal: true,
                                          },
                                        }}>
                                        <Tooltip
                                          title={`${t(
                                            'common:Send a follow-up email',
                                          )}`}>
                                          <IconButton
                                            color="primary"
                                            size="small">
                                            <AddCommentOutlinedIcon />
                                          </IconButton>
                                        </Tooltip>
                                      </Link>
                                    ) : (
                                      <Tooltip
                                        title={`${t(
                                          'common:Send a follow-up email',
                                        )}`}>
                                        <span>
                                          <IconButton
                                            color="primary"
                                            size="small"
                                            disabled>
                                            <AddCommentOutlinedIcon />
                                          </IconButton>
                                        </span>
                                      </Tooltip>
                                    )}
                                  </Grid>
                                  <Grid item>
                                    <Tooltip
                                      title={`${t(
                                        'common:Contract received',
                                      )}`}>
                                      <span>
                                        <IconButton
                                          color="primary"
                                          size="small"
                                          disabled={item.isContractReceived}
                                          onClick={() =>
                                            onOpenContractReceivedModal(item)
                                          }>
                                          <DescriptionOutlinedIcon
                                            style={{ fontSize: 20 }}
                                          />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            )}
                            <TableCell>
                              {t(`common:${item.organizationType.name}`)}
                            </TableCell>

                            <TableCell>{t(`common:${item.status}`)}</TableCell>
                            <TableCell>
                              <StatusIndicator
                                text={
                                  item.isOnboardingEmailSent
                                    ? t('common:Sent')
                                    : t(`common:NotSent`)
                                }
                                variant={followUpStatus}
                              />
                            </TableCell>
                            <TableCell>
                              <StatusIndicator
                                text={
                                  item.epaadId
                                    ? t('common:Completed')
                                    : t('common:Pending')
                                }
                                variant={item.epaadId ? 'success' : 'failure'}
                              />
                            </TableCell>
                            <TableCell>{item.supportPerson.name}</TableCell>
                            <TableCell>
                              {formatDateToMonthDotDayDotFullYear(
                                item.createdOn,
                              )}
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              {item.organizationShortcutName || '-'}
                            </TableCell>
                            <TableCell>{item.numberOfSamples}</TableCell>
                            <TableCell>{item.registeredEmployees}</TableCell>
                            <TableCell>{item?.contacts[0]?.name}</TableCell>
                            <TableCell>{item?.contacts[0]?.email}</TableCell>
                            <TableCell>
                              {item?.contacts[0]?.phoneNumber}
                            </TableCell>

                            <TableCell>
                              {formatDateToMonthDotDayDotFullYear(
                                item.trainingTimestamp,
                              )}
                            </TableCell>
                            <TableCell>
                              {formatDateToMonthDotDayDotFullYear(
                                item.onboardingTimestamp,
                              )}
                            </TableCell>
                            <TableCell>
                              {formatDateToMonthDotDayDotFullYear(
                                item.firstTestTimestamp,
                              )}
                            </TableCell>
                            <TableCell>
                              {getDayName(item.firstTestTimestamp)}
                            </TableCell>
                            <TableCell>{item.area}</TableCell>

                            <TableCell>{item.address}</TableCell>
                            <TableCell>{item.zip}</TableCell>
                            <TableCell>
                              {findCity(citiesList, item.cityId)?.name || '-'}
                            </TableCell>
                            <TableCell>{item.schoolType}</TableCell>
                            <TableCell>{item.manager}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            {!programMembersStatus.requesting && data.length === 0 && (
              <Grid item xs={12}>
                <NoResultsFound />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      {showContractReceivedModal && (
        <ContractReceivedModal
          onClose={onCloseContractReceivedModal}
          data={showContractReceivedModal}
        />
      )}
    </>
  );
};

export default withErrorHandler(ProgramMembersTable);
