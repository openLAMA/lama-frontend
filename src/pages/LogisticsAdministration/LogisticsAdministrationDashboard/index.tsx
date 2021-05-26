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
import { useSelector } from 'react-redux';
import { RouteProps } from 'react-router-dom';

// Material UI
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core';

// Custom components
import LoadingSwapComponent from 'components/loaders/LoadingSwapComponent';
import TemporaryFileUpload from 'pages/LogisticsAdministration/LogisticsAdministrationDashboard/TemporaryFileUpload';

// Utils
import { RootState } from 'redux/combineReducers';

type LogisticsAdministrationDashboardType = RouteProps;

const LogisticsAdministrationDashboard: React.FC<LogisticsAdministrationDashboardType> = () => {
  const username = useSelector(
    (state: RootState) => state.authData.userData?.name,
  );

  const convertSecretFileStatus = useSelector(
    (state: RootState) =>
      state.logisticsAdministrationDashboard.convertSecretFileStatus,
  );
  const tableData = useSelector(
    (state: RootState) => state.logisticsAdministrationDashboard.data,
  );

  return (
    <>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={12}>
          <TemporaryFileUpload />
        </Grid>
        {tableData && (
          <Grid item xs={12}>
            <LoadingSwapComponent
              isLoading={convertSecretFileStatus.requesting}
              center
              text="Loading">
              <Grid container spacing={2}>
                {tableData.map((item: any, index: number) => {
                  return (
                    <Grid item xs={12} key={index}>
                      <Paper>
                        <TableContainer>
                          <Table stickyHeader aria-label="capacity-overview">
                            <TableHead className="table-header-shadow">
                              <TableRow>
                                {item.headers.map((k: any) => {
                                  return <TableCell key={k}>{k}</TableCell>;
                                })}
                                <TableCell>Last change by</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {item.rows.map((row: any, index: number) => {
                                return (
                                  <TableRow key={index}>
                                    {row.map((c: any) => {
                                      return (
                                        <TableCell key={`${index}-${c}`}>
                                          {c}
                                        </TableCell>
                                      );
                                    })}
                                    <TableCell>{username}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </LoadingSwapComponent>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default LogisticsAdministrationDashboard;
