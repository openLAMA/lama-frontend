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
import { useDispatch, useSelector } from 'react-redux';

import { Controller, useForm } from 'react-hook-form';

// Material UI
import { Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Custom components
import ModalWrapper from 'components/Wrappers/ModalWrapper';
import StatusIndicator from 'components/StatusIndicator';

// Actions
import {
  clearAddTemporaryEmployeeToShift,
  getLaboratoryAdministrationTemporaryEmployees,
  addLaboratoryAdministrationTemporaryEmployeeToShift,
} from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/laboratoryAdministrationEditDaySlice';

// Types
import { AddLaboratoryAdministrationTemporaryEmployeeToShiftRequestType } from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/types';

import { LaboratoryTemporaryEmployeeType } from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/types';

// Utils
import { RootState } from 'redux/combineReducers';

// Form validations
import { fieldRequired } from 'formValidation';

interface IAddTemporaryEmployeeToShiftModalProps {
  onClose: () => void;
  data: any;
}

import styles from './AddTemporaryEmployeeToShiftModal.module.scss';

const AddTemporaryEmployeeToShiftModal: React.FC<IAddTemporaryEmployeeToShiftModalProps> = (
  props: IAddTemporaryEmployeeToShiftModalProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { onClose, data } = props;

  const getTemporaryEmployeesStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.getTemporaryEmployeesStatus,
  );

  const temporaryEmployees = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.temporaryEmployees,
  );

  const addTemporaryEmployeeToShiftStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.addTemporaryEmployeeToShiftStatus,
  );

  const { control, errors, handleSubmit } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      employee: '',
    },
  });

  useLayoutEffect(() => {
    dispatch(getLaboratoryAdministrationTemporaryEmployees(data));
  }, []);

  useEffect(() => {
    if (addTemporaryEmployeeToShiftStatus.success) {
      dispatch(clearAddTemporaryEmployeeToShift());
      onClose();
    }
  }, [addTemporaryEmployeeToShiftStatus]);

  const onSubmitForm = (values: any) => {
    const dataToSend: AddLaboratoryAdministrationTemporaryEmployeeToShiftRequestType = {
      date: data.date,
      shiftNumber: data.shiftNumber,
      testingPersonnelId: values.employee.testingPersonnelId,
    };
    dispatch(addLaboratoryAdministrationTemporaryEmployeeToShift(dataToSend));
  };

  const modalTitle =
    data.shift === 'First'
      ? t('modals:Add employee to morning shift')
      : t('modals:Add employee to afternoon shift');

  return (
    <ModalWrapper
      isOpen
      type="primary"
      title={modalTitle}
      loading={
        getTemporaryEmployeesStatus.requesting ||
        addTemporaryEmployeeToShiftStatus.requesting
      }
      onCancel={(event: any) => {
        event.stopPropagation();
        dispatch(clearAddTemporaryEmployeeToShift());
        onClose();
      }}
      onDone={(event: any) => {
        event.stopPropagation();
        handleSubmit(onSubmitForm)();
      }}>
      <Grid container>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="employee"
            rules={{
              validate: {
                fieldRequired,
              },
            }}
            render={({ onChange, ...rest }) => {
              return (
                <Autocomplete
                  {...rest}
                  id="employee"
                  options={temporaryEmployees || []}
                  getOptionLabel={(option: LaboratoryTemporaryEmployeeType) => {
                    return option.testingPersonnelId ? `${option.name}` : '';
                  }}
                  onChange={(
                    event: any,
                    newValue: LaboratoryTemporaryEmployeeType | null,
                  ) => {
                    onChange(newValue);
                    return newValue;
                  }}
                  renderOption={(option: LaboratoryTemporaryEmployeeType) => {
                    return (
                      <div className={styles['dropdown-item']}>
                        <span>{`${option.name}`}</span>
                        <span>
                          <StatusIndicator
                            text={t(`common:Temporary`)}
                            variant="temporary"
                          />
                        </span>
                      </div>
                    );
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label={t('common:Employee')}
                        variant="outlined"
                        error={Boolean(errors?.employee?.message)}
                        helperText={
                          Boolean(errors?.employee?.message)
                            ? t(`formValidation:${errors?.employee?.message}`)
                            : ''
                        }
                      />
                    );
                  }}
                  disabled={
                    getTemporaryEmployeesStatus.requesting ||
                    addTemporaryEmployeeToShiftStatus.requesting
                  }
                />
              );
            }}
          />
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default AddTemporaryEmployeeToShiftModal;
