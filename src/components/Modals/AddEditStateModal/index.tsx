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
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

// Material UI
import { Grid, MenuItem } from '@material-ui/core';

// Custom components
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import ModalWrapper from 'components/Wrappers/ModalWrapper';
import NumberControllerInput from 'components/FormControllerInputs/NumberControlInput';
import DropdownControlInput from 'components/FormControllerInputs/DropdownControlInput';

// Actions
import {
  addState,
  clearAddStateFlags,
  clearUpdateStateFlags,
  getState,
  updateState,
} from 'redux/globalState/capacity/capacitySlice';

// Utils
import { RootState } from 'redux/combineReducers';
import swissStates from 'utils/swissStates';

// Types
import {
  AddStateRequestType,
  UpdateStateRequestType,
} from 'redux/globalState/capacity/types';

interface IAddEditStateModalProps {
  onClose: () => void;
  onSuccess: () => void;
  id?: string;
}

const AddEditStateModal: React.FC<IAddEditStateModalProps> = (
  props: IAddEditStateModalProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { onClose, onSuccess, id } = props;

  const addStateStatus = useSelector(
    (state: RootState) => state.capacity.addStateStatus,
  );

  const getStateStatus = useSelector(
    (state: RootState) => state.capacity.getStateStatus,
  );

  const editStateData = useSelector(
    (state: RootState) => state.capacity.editStateData,
  );

  const updateStateStatus = useSelector(
    (state: RootState) => state.capacity.updateStateStatus,
  );

  const { control, handleSubmit, errors, setValue } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      canton: '',
      mondaySamples: '',
      tuesdaySamples: '',
      wednesdaySamples: '',
      thursdaySamples: '',
      fridaySamples: '',
    },
  });

  useEffect(() => {
    if (addStateStatus.success) {
      onSuccess();
      dispatch(clearAddStateFlags());
    }
  }, [addStateStatus]);

  useEffect(() => {
    if (updateStateStatus.success) {
      onSuccess();
      dispatch(clearUpdateStateFlags());
    }
  }, [updateStateStatus]);

  useEffect(() => {
    if (id) {
      dispatch(getState({ id }));
    }
  }, [id]);

  useEffect(() => {
    if (getStateStatus.success && editStateData) {
      setValue('canton', editStateData.name, { shouldValidate: true });
      setValue(
        'mondaySamples',
        editStateData.cantonWeekdaysSamples.mondaySamples,
        { shouldValidate: true },
      );
      setValue(
        'tuesdaySamples',
        editStateData.cantonWeekdaysSamples.tuesdaySamples,
        { shouldValidate: true },
      );
      setValue(
        'wednesdaySamples',
        editStateData.cantonWeekdaysSamples.wednesdaySamples,
        { shouldValidate: true },
      );
      setValue(
        'thursdaySamples',
        editStateData.cantonWeekdaysSamples.thursdaySamples,
        { shouldValidate: true },
      );
      setValue(
        'fridaySamples',
        editStateData.cantonWeekdaysSamples.fridaySamples,
        { shouldValidate: true },
      );
    }
  }, [editStateData, getStateStatus]);

  const onSubmitForm = (values: any) => {
    const findState = swissStates.find((state) => state.name === values.canton);
    if (findState) {
      if (id) {
        const data: UpdateStateRequestType = {
          name: findState.name,
          shortName: findState.shortName,
          cantonWeekdaysSamples: {
            mondaySamples: values.mondaySamples,
            tuesdaySamples: values.tuesdaySamples,
            wednesdaySamples: values.wednesdaySamples,
            thursdaySamples: values.thursdaySamples,
            fridaySamples: values.fridaySamples,
            cantonId: editStateData?.cantonWeekdaysSamples.cantonId || '',
            id: editStateData?.cantonWeekdaysSamples.id || '',
          },
          countryId: editStateData?.countryId || '',
          id,
        };
        dispatch(updateState(data));
      } else {
        const data: AddStateRequestType = {
          name: findState.name,
          shortName: findState.shortName,
          cantonWeekdaysSamples: {
            mondaySamples: values.mondaySamples,
            tuesdaySamples: values.tuesdaySamples,
            wednesdaySamples: values.wednesdaySamples,
            thursdaySamples: values.thursdaySamples,
            fridaySamples: values.fridaySamples,
          },
        };
        dispatch(addState(data));
      }
    }
  };

  return (
    <>
      <ModalWrapper
        isOpen
        type="primary"
        title={id ? t('modals:Edit state') : t('modals:Add state')}
        loading={
          addStateStatus.requesting ||
          updateStateStatus.requesting ||
          getStateStatus.requesting
        }
        onCancel={(event: any) => {
          event.stopPropagation();
          onClose();
        }}
        dialogWidth="450px"
        onOK={(event: any) => {
          event.stopPropagation();
          handleSubmit(onSubmitForm)();
        }}>
        <BasicFormWrapper>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DropdownControlInput
                  control={control}
                  name="canton"
                  label={t('common:State')}
                  labelId="type"
                  id="canton-select"
                  fieldRequired
                  error={Boolean(errors?.canton?.message)}
                  errorMessage={errors?.canton?.message}
                  menuItems={swissStates?.map(
                    (state: { name: string; shortName: string }) => {
                      return (
                        <MenuItem key={state.name} value={state.name}>
                          {`${state.name} (${state.shortName})`}
                        </MenuItem>
                      );
                    },
                  )}
                  disabled={
                    addStateStatus.requesting ||
                    updateStateStatus.requesting ||
                    Boolean(id)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <NumberControllerInput
                  control={control}
                  name="mondaySamples"
                  label={t('common:Monday')}
                  id="monday-input"
                  fieldRequired
                  numberMustBePositive
                  error={Boolean(errors?.mondaySamples?.message)}
                  errorMessage={errors?.mondaySamples?.message}
                  disabled={
                    addStateStatus.requesting || updateStateStatus.requesting
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <NumberControllerInput
                  control={control}
                  name="tuesdaySamples"
                  label={t('common:Tuesday')}
                  id="tuesday-input"
                  fieldRequired
                  numberMustBePositive
                  error={Boolean(errors?.tuesdaySamples?.message)}
                  errorMessage={errors?.tuesdaySamples?.message}
                  disabled={
                    addStateStatus.requesting || updateStateStatus.requesting
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <NumberControllerInput
                  control={control}
                  name="wednesdaySamples"
                  label={t('common:Wednesday')}
                  id="wednesday-input"
                  fieldRequired
                  numberMustBePositive
                  error={Boolean(errors?.wednesdaySamples?.message)}
                  errorMessage={errors?.wednesdaySamples?.message}
                  disabled={
                    addStateStatus.requesting || updateStateStatus.requesting
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <NumberControllerInput
                  control={control}
                  name="thursdaySamples"
                  label={t('common:Thursday')}
                  id="thursday-input"
                  fieldRequired
                  numberMustBePositive
                  error={Boolean(errors?.thursdaySamples?.message)}
                  errorMessage={errors?.thursdaySamples?.message}
                  disabled={
                    addStateStatus.requesting || updateStateStatus.requesting
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <NumberControllerInput
                  control={control}
                  name="fridaySamples"
                  label={t('common:Friday')}
                  id="friday-input"
                  fieldRequired
                  numberMustBePositive
                  error={Boolean(errors?.fridaySamples?.message)}
                  errorMessage={errors?.fridaySamples?.message}
                  disabled={
                    addStateStatus.requesting || updateStateStatus.requesting
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </BasicFormWrapper>
      </ModalWrapper>
    </>
  );
};

export default AddEditStateModal;
