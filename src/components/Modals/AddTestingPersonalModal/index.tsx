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

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

// Material UI
import {
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Switch,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Custom components
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import ModalWrapper from 'components/Wrappers/ModalWrapper';
import TextControllerInput from 'components/FormControllerInputs/TextControllerInput';
import DropdownControllerInput from 'components/FormControllerInputs/DropdownControlInput';

// Actions
import {
  addLaboratoryTestingPerson,
  clearLaboratoryTestingPersonFlags,
} from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/organizationAdministrationTestingPersonalSlice';

// Utils
import { RootState } from 'redux/combineReducers';

// Types
import { ShiftType } from 'redux/globalTypes';
import { AddLaboratoryTestingPersonalType } from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/types';

// Form validations
import { atLeastOneItemInMultiSelect } from 'formValidation';
import shiftEnum from 'utils/shiftsEnum';

interface ITestingPersonalModalProps {
  onClose: () => void;
}

type shiftSelectType = {
  id: ShiftType;
};

const selectEmployer = [
  {
    id: 0,
    employer: 'FHWN',
  },
  {
    id: 1,
    employer: 'Biolytix',
  },
];

const selectWorkingAreas: string[] = ['Pooling', 'Labor', 'Admin'];

const selectShift: shiftSelectType[] = [
  {
    id: shiftEnum.None,
  },
  {
    id: shiftEnum.First,
  },
  {
    id: shiftEnum.Second,
  },
  {
    id: shiftEnum.FullDay,
  },
];

const employeeTypes: string[] = ['Normal', 'Fixed', 'Temporary'];

const AddTestingPersonalModal: React.FC<ITestingPersonalModalProps> = (
  props: ITestingPersonalModalProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { onClose } = props;

  const testingPersonalStatusTypesList = useSelector(
    (state: RootState) =>
      state.laboratoryTestingPersonalData.testingPersonalStatusTypes,
  );

  const testingPersonalStatus = useSelector(
    (state: RootState) =>
      state.laboratoryTestingPersonalData.addLaboratoryTestingPersonalStatus,
  );

  const testingPersonalTableData = useSelector(
    (state: RootState) =>
      state.laboratoryTestingPersonalData.testingPersonalsTableData,
  );

  const { control, handleSubmit, errors, setError, watch } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      status: '',
      statusId: '',
      statusText: '',
      employer: '',
      workingAreas: [],
      type: 'Normal',
      mondayShift: 'None',
      tuesdayShift: 'None',
      wednesdayShift: 'None',
      thursdayShift: 'None',
      fridayShift: 'None',
    },
  });
  const watchType = watch('type');

  useEffect(() => {
    if (testingPersonalStatus.success) {
      onClose();
      dispatch(clearLaboratoryTestingPersonFlags());
    }
  }, [testingPersonalStatus]);

  const onSubmitForm = (values: any) => {
    const foundSameUser = testingPersonalTableData?.result?.find(
      (user) => user.email === values.email,
    );
    if (foundSameUser) {
      setError('email', {
        type: 'manual',
        message: t('formValidation:This email address is already being used!'),
        shouldFocus: true,
      });
      return;
    }
    const data: AddLaboratoryTestingPersonalType = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      statusId: values.statusId,
      employeer: values.employer,
      workingAreas: values.workingAreas
        ? values.workingAreas.map((item: string) => {
            return {
              workingArea: item,
            };
          })
        : [],
      type: values.type,
      mondayShift: values.mondayShift,
      tuesdayShift: values.tuesdayShift,
      wednesdayShift: values.wednesdayShift,
      thursdayShift: values.thursdayShift,
      fridayShift: values.fridayShift,
    };
    if (values.type === 'Temporary') {
      data.workingAreas = [
        {
          workingArea: 'Pooling',
        },
      ];
      data.employeer = 'None';
    }
    dispatch(addLaboratoryTestingPerson(data));
  };

  return (
    <>
      <ModalWrapper
        isOpen
        type="primary"
        title={t('modals:Add testing personal')}
        loading={testingPersonalStatus.requesting}
        onCancel={(event: any) => {
          event.stopPropagation();
          onClose();
        }}
        onOK={(event: any) => {
          event.stopPropagation();
          handleSubmit(onSubmitForm)();
        }}>
        <BasicFormWrapper>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DropdownControllerInput
                  control={control}
                  name="type"
                  label={t('common:Type')}
                  labelId="testing-personnel-type"
                  id="testing-personnel-select"
                  fieldRequired
                  error={Boolean(errors?.type?.message)}
                  errorMessage={errors?.type?.message}
                  menuItems={employeeTypes?.map((type) => {
                    return (
                      <MenuItem key={type} value={type}>
                        {t(`common:${type}`)}
                      </MenuItem>
                    );
                  })}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextControllerInput
                  control={control}
                  name="firstName"
                  label={t('common:First name')}
                  id="first-name-input"
                  fieldRequired
                  maxNumberOfCharacter={100}
                  error={Boolean(errors?.firstName?.message)}
                  errorMessage={errors?.firstName?.message}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextControllerInput
                  control={control}
                  name="lastName"
                  label={t('common:Last name')}
                  id="last-name-input"
                  fieldRequired
                  maxNumberOfCharacter={100}
                  error={Boolean(errors?.lastName?.message)}
                  errorMessage={errors?.lastName?.message}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextControllerInput
                  control={control}
                  name="email"
                  label={t('common:Email')}
                  id="email-input"
                  fieldRequired
                  mustBeValidEmailValidation
                  error={Boolean(errors?.email?.message)}
                  errorMessage={errors?.email?.message}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
              {watchType !== 'Temporary' && (
                <Grid item xs={12} md={6}>
                  <DropdownControllerInput
                    control={control}
                    name="employer"
                    label={t('common:Employer')}
                    labelId="employer"
                    id="employer-select"
                    fieldRequired
                    error={Boolean(errors?.employer?.message)}
                    errorMessage={errors?.employer?.message}
                    menuItems={selectEmployer?.map((employer) => {
                      return (
                        <MenuItem key={employer.id} value={employer.id}>
                          {employer.employer}
                        </MenuItem>
                      );
                    })}
                    disabled={testingPersonalStatus.requesting}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={watchType === 'Temporary' ? 12 : 6}>
                <DropdownControllerInput
                  control={control}
                  name="statusId"
                  label={t('common:Status')}
                  labelId="statusId"
                  id="statusId-select"
                  fieldRequired
                  error={Boolean(errors?.statusId?.message)}
                  errorMessage={errors?.statusId?.message}
                  menuItems={testingPersonalStatusTypesList?.map((status) => {
                    return (
                      <MenuItem key={status.id} value={status.id}>
                        {status.name}
                      </MenuItem>
                    );
                  })}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
              {watchType !== 'Temporary' && (
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="workingAreas"
                    rules={{
                      validate: {
                        atLeastOneItemInMultiSelect,
                      },
                    }}
                    render={({ ref, onChange, ...rest }) => {
                      return (
                        <Autocomplete
                          {...rest}
                          multiple
                          id="workingAreas"
                          options={selectWorkingAreas}
                          getOptionLabel={(option: any) => {
                            return option || '';
                          }}
                          onChange={(event: any, newValue: any) => {
                            onChange(newValue);
                            return newValue;
                          }}
                          filterSelectedOptions
                          renderOption={(option: any) => {
                            return <span>{option}</span>;
                          }}
                          renderInput={(params) => {
                            return (
                              <TextField
                                {...params}
                                label={t('common:Working area')}
                                variant="outlined"
                                error={Boolean(errors.workingAreas?.message)}
                                helperText={
                                  Boolean(errors.workingAreas?.message)
                                    ? t(
                                        `formValidation:${errors.workingAreas?.message}`,
                                      )
                                    : ''
                                }
                              />
                            );
                          }}
                        />
                      );
                    }}
                  />
                </Grid>
              )}

              <Grid
                item
                xs={12}
                className={`${watchType !== 'Fixed' && 'display-none'}`}>
                <DropdownControllerInput
                  control={control}
                  name="mondayShift"
                  label={t('common:Monday')}
                  labelId="monday"
                  id="monday-shift-select"
                  fieldRequired
                  error={Boolean(errors?.mondayShift?.message)}
                  errorMessage={errors?.mondayShift?.message}
                  menuItems={selectShift.map((shift) => {
                    return (
                      <MenuItem key={shift.id} value={shift.id}>
                        {t(`common:shiftName.${shift.id}`)}
                      </MenuItem>
                    );
                  })}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
              <Grid
                item
                xs={12}
                className={`${watchType !== 'Fixed' && 'display-none'}`}>
                <DropdownControllerInput
                  control={control}
                  name="tuesdayShift"
                  label={t('common:Tuesday')}
                  labelId="tuesday"
                  id="tuesday-shift-select"
                  fieldRequired
                  error={Boolean(errors?.tuesdayShift?.message)}
                  errorMessage={errors?.tuesdayShift?.message}
                  menuItems={selectShift.map((shift) => {
                    return (
                      <MenuItem key={shift.id} value={shift.id}>
                        {t(`common:shiftName.${shift.id}`)}
                      </MenuItem>
                    );
                  })}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
              <Grid
                item
                xs={12}
                className={`${watchType !== 'Fixed' && 'display-none'}`}>
                <DropdownControllerInput
                  control={control}
                  name="wednesdayShift"
                  label={t('common:Wednesday')}
                  labelId="wednesday"
                  id="wednesday-shift-select"
                  fieldRequired
                  error={Boolean(errors?.wednesdayShift?.message)}
                  errorMessage={errors?.wednesdayShift?.message}
                  menuItems={selectShift.map((shift) => {
                    return (
                      <MenuItem key={shift.id} value={shift.id}>
                        {t(`common:shiftName.${shift.id}`)}
                      </MenuItem>
                    );
                  })}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
              <Grid
                item
                xs={12}
                className={`${watchType !== 'Fixed' && 'display-none'}`}>
                <DropdownControllerInput
                  control={control}
                  name="thursdayShift"
                  label={t('common:Thursday')}
                  labelId="thursday"
                  id="thursday-shift-select"
                  fieldRequired
                  error={Boolean(errors?.thursdayShift?.message)}
                  errorMessage={errors?.thursdayShift?.message}
                  menuItems={selectShift.map((shift) => {
                    return (
                      <MenuItem key={shift.id} value={shift.id}>
                        {t(`common:shiftName.${shift.id}`)}
                      </MenuItem>
                    );
                  })}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
              <Grid
                item
                xs={12}
                className={`${watchType !== 'Fixed' && 'display-none'}`}>
                <DropdownControllerInput
                  control={control}
                  name="fridayShift"
                  label={t('common:Friday')}
                  labelId="friday"
                  id="friday-shift-select"
                  fieldRequired
                  error={Boolean(errors?.fridayShift?.message)}
                  errorMessage={errors?.fridayShift?.message}
                  menuItems={selectShift.map((shift) => {
                    return (
                      <MenuItem key={shift.id} value={shift.id}>
                        {t(`common:shiftName.${shift.id}`)}
                      </MenuItem>
                    );
                  })}
                  disabled={testingPersonalStatus.requesting}
                />
              </Grid>
            </Grid>
          </Grid>
        </BasicFormWrapper>
      </ModalWrapper>
    </>
  );
};

export default AddTestingPersonalModal;
