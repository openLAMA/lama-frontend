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

import React, { useLayoutEffect, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteProps, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { isToday, isFuture } from 'date-fns';

// Material UI
import { Grid, Typography } from '@material-ui/core';

// Custom components
import PageContainerWithHeader from 'components/PageContainerWithHeader';
import LoadingSwapComponent from 'components/loaders/LoadingSwapComponent';
import EditDayShiftsTable from 'components/Tables/EditDayShiftsTable';

// Actions
import {
  getLaboratoryAdministrationEditDayData,
  clearIncreaseShiftCountForDayStatus,
} from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/laboratoryAdministrationEditDaySlice';

// Routes
import { LabAdministrationRoutes } from 'config/routes';

// Utils
import { RootState } from 'redux/combineReducers';
import {
  formatDateToMonthDotDayDotFullYear,
  checkDateAndConvert,
  isDateValid,
} from 'utils/dateFNSCustom';

// Types
type LabAdministrationEditDayType = RouteProps;
type reactParamsType = {
  date: string;
};

const LabAdministrationEditDay: React.FC<LabAdministrationEditDayType> = () => {
  const dispatch = useDispatch();
  const reactParams: reactParamsType = useParams();
  const { t } = useTranslation();
  const isProvidedDateValid = isDateValid(reactParams.date);

  const removeConfirmedPersonStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.removeConfirmedPersonStatus,
  );

  const addEmployeeToShiftStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.addEmployeeToShiftStatus,
  );

  const addTemporaryEmployeeToShiftStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.addTemporaryEmployeeToShiftStatus,
  );

  const removeTemporaryEmployeeFromShiftStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay
        .removeTemporaryEmployeeFromShiftStatus,
  );

  const increaseShiftCountForDayStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.increaseShiftCountForDayStatus,
  );

  const getDayDataStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.getDayDataStatus,
  );

  useLayoutEffect(() => {
    if (isProvidedDateValid) {
      dispatch(
        getLaboratoryAdministrationEditDayData({
          date: reactParams.date,
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (
      removeConfirmedPersonStatus.success ||
      addEmployeeToShiftStatus.success ||
      increaseShiftCountForDayStatus.success ||
      addTemporaryEmployeeToShiftStatus.success ||
      removeTemporaryEmployeeFromShiftStatus.success
    ) {
      dispatch(
        getLaboratoryAdministrationEditDayData({
          date: reactParams.date,
        }),
      );
      if (increaseShiftCountForDayStatus.success) {
        dispatch(clearIncreaseShiftCountForDayStatus());
      }
    }
  }, [
    removeConfirmedPersonStatus,
    addEmployeeToShiftStatus,
    increaseShiftCountForDayStatus,
    addTemporaryEmployeeToShiftStatus,
    removeTemporaryEmployeeFromShiftStatus,
  ]);

  const isLoading = getDayDataStatus.requesting;

  let text = '';
  if (getDayDataStatus.requesting) {
    text = t('progressMessages:Fetching data');
  }

  const editingDate = checkDateAndConvert(reactParams.date);
  let isEditingDateTodayOrAfter = false;
  if (editingDate) {
    if (isToday(editingDate) || isFuture(editingDate)) {
      isEditingDateTodayOrAfter = true;
    }
  }
  const isReadOnly = !isEditingDateTodayOrAfter;

  if (!isProvidedDateValid) {
    return (
      <Grid
        className="fullHeight"
        container
        justify="center"
        alignItems="center">
        <Grid item>
          <Typography variant="h2">
            {t('common:Sorry, the provided date is invalid')}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <PageContainerWithHeader
        title={`${t(
          `common:${LabAdministrationRoutes.editDayRoute.title}`,
        )} ${formatDateToMonthDotDayDotFullYear(reactParams.date)}`}>
        <LoadingSwapComponent isLoading={isLoading} center text={text}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <Grid item>
                <EditDayForm />
              </Grid>
            </Grid> */}
            <Grid item xs={12}>
              <Grid item>
                <EditDayShiftsTable
                  isReadOnly={isReadOnly}
                  forDate={reactParams.date}
                />
              </Grid>
            </Grid>
          </Grid>
        </LoadingSwapComponent>
      </PageContainerWithHeader>
    </>
  );
};

export default LabAdministrationEditDay;
