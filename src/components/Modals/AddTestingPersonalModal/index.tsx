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
import { Grid, MenuItem, TextField } from '@material-ui/core';
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
import { AddLaboratoryTestingPersonalType } from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/types';

// Form validations
import { atLeastOneItemInMultiSelect } from 'formValidation';

interface ITestingPersonalModalProps {
  onClose: () => void;
}

type workingAreaType = {
  id: number;
  workingArea: string;
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

const selectWorkingAreas: workingAreaType[] = [
  {
    id: 0,
    workingArea: 'Pooling',
  },
  {
    id: 1,
    workingArea: 'Labor',
  },
  {
    id: 2,
    workingArea: 'Admin',
  },
];

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

  const { control, handleSubmit, errors } = useForm<any>({
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
    },
  });

  useEffect(() => {
    if (testingPersonalStatus.success) {
      onClose();
      dispatch(clearLaboratoryTestingPersonFlags());
    }
  }, [testingPersonalStatus]);

  const onSubmitForm = (values: any) => {
    const data: AddLaboratoryTestingPersonalType = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      statusId: values.statusId,
      employeer: values.employer,
      workingAreas: values.workingAreas.map((item: any) => {
        return {
          workingArea: item.id,
        };
      }),
    };

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
              <Grid item xs={12} md={6}>
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
                          return option.workingArea || '';
                        }}
                        onChange={(event: any, newValue: any) => {
                          onChange(newValue);
                          return newValue;
                        }}
                        filterSelectedOptions
                        renderOption={(option: any) => {
                          return <span>{option.workingArea}</span>;
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              label={t('common:Working area')}
                              variant="outlined"
                              error={Boolean(errors.workingAreas?.message)}
                              helperText={errors.workingAreas?.message}
                            />
                          );
                        }}
                      />
                    );
                  }}
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
