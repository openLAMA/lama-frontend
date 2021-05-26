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
  clearAddEmployeeToShift,
  getLaboratoryAdministrationEmployees,
  addLaboratoryAdministrationEmployeeToShift,
} from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/laboratoryAdministrationEditDaySlice';

// Types
import { AddLaboratoryAdministrationEmployeeToShiftRequestType } from 'redux/laboratoryAdministration/laboratotyAdministrationEditDay/types';

import {
  LaboratoryTestingPersonalResultType,
  TestingPersonnelType,
} from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/types';
import { CapacityOverviewShiftConfirmedEmployeeType } from 'redux/globalState/capacity/types';

// Utils
import { RootState } from 'redux/combineReducers';

// Form validations
import { fieldRequired } from 'formValidation';

interface IAddEmployeeToShiftModalProps {
  onClose: () => void;
  data: any;
}

import styles from './AddEmployeeToShiftModal.module.scss';

const AddEmployeeToShiftModal: React.FC<IAddEmployeeToShiftModalProps> = (
  props: IAddEmployeeToShiftModalProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { onClose, data } = props;

  const getEmployeesStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.getEmployeesStatus,
  );

  const employees = useSelector(
    (state: RootState) => state.laboratoryAdministrationEditDay.employees,
  );

  const filteredEmployees: LaboratoryTestingPersonalResultType[] = employees
    ? employees.filter((employee: LaboratoryTestingPersonalResultType) => {
        const foundConfirmedEmployee = data.shiftData.confirmedEmployees.find(
          (person: CapacityOverviewShiftConfirmedEmployeeType) =>
            person.email === employee.email,
        );
        if (foundConfirmedEmployee) {
          return foundConfirmedEmployee.isCanceled;
        }
        const foundFixedEmployee = data.shiftData.fixedEmployees.find(
          (person: CapacityOverviewShiftConfirmedEmployeeType) =>
            person.email === employee.email,
        );
        if (foundFixedEmployee) {
          return false;
        }
        return true;
      })
    : [];

  const addEmployeeToShiftStatus = useSelector(
    (state: RootState) =>
      state.laboratoryAdministrationEditDay.addEmployeeToShiftStatus,
  );

  const { control, errors, handleSubmit } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      employee: '',
    },
  });

  useLayoutEffect(() => {
    dispatch(getLaboratoryAdministrationEmployees());
  }, []);

  useEffect(() => {
    if (addEmployeeToShiftStatus.success) {
      dispatch(clearAddEmployeeToShift());
      onClose();
    }
  }, [addEmployeeToShiftStatus]);

  const onSubmitForm = (values: any) => {
    const dataToSend: AddLaboratoryAdministrationEmployeeToShiftRequestType = {
      date: data.forDate,
      shifts: [data.shift],
      testingPersonnelId: values.employee.id,
    };
    dispatch(addLaboratoryAdministrationEmployeeToShift(dataToSend));
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
      loading={addEmployeeToShiftStatus.requesting}
      onCancel={(event: any) => {
        event.stopPropagation();
        dispatch(clearAddEmployeeToShift());
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
                  options={filteredEmployees || []}
                  getOptionLabel={(
                    option: LaboratoryTestingPersonalResultType,
                  ) => {
                    return option.id
                      ? `${option.firstName} ${option.lastName}`
                      : '';
                  }}
                  onChange={(
                    event: any,
                    newValue: LaboratoryTestingPersonalResultType | null,
                  ) => {
                    onChange(newValue);
                    return newValue;
                  }}
                  renderOption={(
                    option: LaboratoryTestingPersonalResultType,
                  ) => {
                    const statusInd: any = (type: TestingPersonnelType) => ({
                      fixed: (
                        <StatusIndicator
                          text={t(`common:${type}`)}
                          variant="information"
                        />
                      ),
                      normal: (
                        <StatusIndicator
                          text={t(`common:${type}`)}
                          variant="success"
                        />
                      ),
                      temporary: (
                        <StatusIndicator
                          text={t(`common:${type}`)}
                          variant="temporary"
                        />
                      ),
                    });

                    return (
                      <div className={styles['dropdown-item']}>
                        <span>{`${option.firstName} ${option.lastName}`}</span>
                        <span>
                          {
                            statusInd(option.type)[
                              option.type.toLocaleLowerCase()
                            ]
                          }
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
                    getEmployeesStatus.requesting ||
                    addEmployeeToShiftStatus.requesting
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

export default AddEmployeeToShiftModal;
