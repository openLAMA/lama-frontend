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
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Controller,
  DeepMap,
  FieldError,
  useFieldArray,
  useForm,
  SubmitHandler,
} from 'react-hook-form';

// Material UI
import {
  MenuItem,
  Grid,
  TextField,
  Button,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Material Icons
import {
  AddCircleOutline as AddCircleOutlineIcon,
  DeleteOutline as DeleteOutlineIcon,
  HelpOutlineOutlined as HelpOutlineOutlinedIcon,
} from '@material-ui/icons';

// Custom components
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import Card from 'components/Card';
import TextControllerInput from 'components/FormControllerInputs/TextControllerInput';
import NumberControllerInput from 'components/FormControllerInputs/NumberControlInput';
import DropdownControllerInput from 'components/FormControllerInputs/DropdownControlInput';
import OrganizationRegistrationContainer from 'components/pageSpecific/OrganizationRegistration/OrganizationRegistrationContainer';

// Actions
import { setOrganizationData } from 'redux/organizationRegistration/organizationRegistrationSlice';

// Types
import { ContactPersonType, OrganizationTypeType } from 'redux/globalTypes';
import { RegisterOrganizationType } from 'redux/organizationRegistration/types';
import { CityType } from 'redux/globalState/citiesData/types';

// Utils
import { RootState } from 'redux/combineReducers';
import { findCity } from 'utils/findCity';

// Form validations
import { fieldRequired } from 'formValidation';
interface IOrganizationRegistrationFormProps {
  onCancelRegistration: () => void;
  handleNext: () => void;
}

const OrganizationRegistrationForm: React.FC<IOrganizationRegistrationFormProps> = (
  props: IOrganizationRegistrationFormProps,
) => {
  const { onCancelRegistration, handleNext } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const organizationData = useSelector(
    (state: RootState) => state.organizationRegistrationData.data,
  );

  const citiesList = useSelector((state: RootState) => state.cities.cities);
  const organizationTypesList = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypes,
  );

  const foundCity = findCity(citiesList, organizationData.cityId);

  const {
    control,
    handleSubmit,
    setValue,
    errors,
    setError,
    watch,
    trigger,
  } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      organizationName: organizationData.name || '',
      type: organizationData.typeId !== -1 ? organizationData.typeId : '',
      city: foundCity || '',
      ZIP: organizationData.ZIP || '',
      contactPeople: organizationData.contacts || [
        {
          email: '',
          name: '',
          phoneNumber: '',
          phoneLineNumber: '',
        },
      ],
      numberOfSamples: organizationData.numberOfSamples || '',
      numberOfPools: organizationData.numberOfPools || '',
      addressForPickupAndDelivery: organizationData.address || '',
    },
  });

  const contactPeopleFieldArray = useFieldArray({
    control,
    name: 'contactPeople',
    keyName: 'contactKey',
  });

  if (contactPeopleFieldArray.fields.length === 0) {
    contactPeopleFieldArray.append({
      name: '',
      email: '',
      phoneNumber: '',
      landLineNumber: '',
    });
  }

  const watchCity = watch('city');
  const watchType = watch('type');

  const onSubmitForm: SubmitHandler<any> = async (values) => {
    const { contactPeople } = values;
    const findSameEmailIndex = contactPeople.findIndex(
      (item: Record<string, unknown>, index: number): boolean => {
        for (let i = index + 1; i < contactPeople.length; i += 1) {
          if (item.email === contactPeople[i].email) {
            return true;
          }
        }
        return false;
      },
    );
    if (findSameEmailIndex !== -1) {
      setError(`contactPeople[${findSameEmailIndex}].email`, {
        type: 'manual',
        message: t('formValidation:This email address is already being used!'),
        shouldFocus: true,
      });
    } else {
      const newValues: RegisterOrganizationType = {
        name: values.organizationName,
        typeId: values.type,
        cityId: values.city.id,
        ZIP: values.ZIP,
        contacts: values.contactPeople,
        numberOfSamples: parseInt(values.numberOfSamples, 10) || null,
        numberOfPools: parseInt(values.numberOfPools, 10) || null,
        address: values.addressForPickupAndDelivery,
      };
      dispatch(setOrganizationData(newValues));
      handleNext();
    }
  };

  useEffect(() => {
    if (watchCity) {
      setValue('ZIP', watchCity.zipCode, {
        shouldValidate: true,
      });
    } else {
      setValue('ZIP', '');
    }
  }, [watchCity]);

  return (
    <OrganizationRegistrationContainer title={t('common:General information')}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card largePadding>
            <Grid container>
              <Grid item xs={12}>
                <BasicFormWrapper>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="h6">
                            {t('common:Organization details')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextControllerInput
                                control={control}
                                name="organizationName"
                                label={t('common:Organization name')}
                                id="organization-name-input"
                                fieldRequired
                                maxNumberOfCharacter={100}
                                error={Boolean(
                                  errors.organizationName?.message,
                                )}
                                errorMessage={errors.organizationName?.message}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={11}>
                                  <DropdownControllerInput
                                    control={control}
                                    name="type"
                                    label={t('common:Type')}
                                    labelId="type"
                                    id="organization-type-select"
                                    fieldRequired
                                    error={Boolean(errors?.type?.message)}
                                    errorMessage={errors?.type?.message}
                                    menuItems={organizationTypesList?.map(
                                      (orgType: OrganizationTypeType) => {
                                        return (
                                          <MenuItem
                                            key={orgType.id}
                                            value={orgType.id}>
                                            {t(`common:${orgType.name}`)}
                                          </MenuItem>
                                        );
                                      },
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={1}>
                                  <Tooltip
                                    title={
                                      <Grid container direction="column">
                                        <Grid item>
                                          {`${t(
                                            'common:In case you can’t find your match',
                                          )}`}
                                        </Grid>
                                        <Grid item>
                                          {`${t(
                                            'common:Please apply the following logic',
                                          )}:`}
                                        </Grid>
                                        <Grid item>
                                          {`${t('common:Community')} -> ${t(
                                            'common:Business',
                                          )}`}
                                        </Grid>
                                        <Grid item>
                                          {`${t(
                                            'common:Social Institution',
                                          )} -> ${t('common:Business')}`}
                                        </Grid>
                                      </Grid>
                                    }
                                    arrow
                                    placement="right">
                                    <HelpOutlineOutlinedIcon />
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Controller
                                control={control}
                                name="city"
                                rules={{
                                  validate: {
                                    fieldRequired,
                                  },
                                }}
                                render={({ onChange, ...rest }) => {
                                  return (
                                    <Autocomplete
                                      {...rest}
                                      id="city"
                                      options={citiesList}
                                      getOptionLabel={(option: CityType) => {
                                        return option.name || '';
                                      }}
                                      onChange={(
                                        event: any,
                                        newValue: CityType | null,
                                      ) => {
                                        onChange(newValue);
                                        return newValue;
                                      }}
                                      getOptionSelected={(
                                        optionSelected: CityType,
                                      ) => {
                                        return optionSelected?.name
                                          ? true
                                          : false;
                                      }}
                                      renderOption={(option: CityType) => {
                                        return (
                                          <Grid
                                            container
                                            justify="space-between">
                                            <Grid item>{option.name}</Grid>
                                            <Grid item>{option.zipCode}</Grid>
                                          </Grid>
                                        );
                                      }}
                                      renderInput={(params) => {
                                        return (
                                          <TextField
                                            {...params}
                                            label={t('common:City')}
                                            variant="outlined"
                                            error={Boolean(
                                              errors.city?.message,
                                            )}
                                            helperText={
                                              Boolean(errors.city?.message)
                                                ? t(
                                                    `formValidation:${errors.city?.message}`,
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
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={9}>
                              <TextControllerInput
                                control={control}
                                name="addressForPickupAndDelivery"
                                label={t(
                                  'common:Address for pickup and delivery',
                                )}
                                id="address-for-pickup-and-delivery-input"
                                fieldRequired
                                maxNumberOfCharacter={200}
                                error={Boolean(
                                  errors.addressForPickupAndDelivery?.message,
                                )}
                                errorMessage={
                                  errors.addressForPickupAndDelivery?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextControllerInput
                                control={control}
                                name="ZIP"
                                label={t('common:ZIP')}
                                id="zip-code-input"
                                fieldRequired
                                error={Boolean(errors.ZIP?.message)}
                                errorMessage={errors.ZIP?.message}
                                disabled
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      {contactPeopleFieldArray.fields.map((item, index) => {
                        let contactPeopleErrors:
                          | DeepMap<ContactPersonType, FieldError>
                          | undefined;
                        if (
                          errors?.contactPeople &&
                          errors.contactPeople[index]
                        ) {
                          contactPeopleErrors = errors.contactPeople[index];
                        }

                        return (
                          <Grid key={item.id} container spacing={2}>
                            <Grid item xs={12}>
                              <Grid container justify="space-between">
                                <Grid item>
                                  <Typography variant="h6">
                                    {`${t('common:Contact person')} ${
                                      index >= 1 ? index + 1 : ''
                                    }`}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  {index === 0 ? (
                                    <Button
                                      color="secondary"
                                      startIcon={<AddCircleOutlineIcon />}
                                      onClick={() =>
                                        contactPeopleFieldArray.append({
                                          name: '',
                                          email: '',
                                          phoneNumber: '',
                                          landLineNumber: '',
                                        })
                                      }>
                                      <Typography>
                                        {t('common:Add another contact')}
                                      </Typography>
                                    </Button>
                                  ) : (
                                    <Button
                                      color="primary"
                                      startIcon={<DeleteOutlineIcon />}
                                      onClick={() =>
                                        contactPeopleFieldArray.remove(index)
                                      }>
                                      <Typography>
                                        {t('common:Delete')}
                                      </Typography>
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`contactPeople[${index}].name`}
                                    label={t('common:Name')}
                                    id="contact-person-input"
                                    fieldRequired
                                    maxNumberOfCharacter={100}
                                    defaultValue={item.name}
                                    error={Boolean(
                                      contactPeopleErrors?.name?.message,
                                    )}
                                    errorMessage={
                                      contactPeopleErrors?.name?.message
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`contactPeople[${index}].email`}
                                    label={t('common:Email')}
                                    id="contact-email-input"
                                    fieldRequired
                                    maxNumberOfCharacter={50}
                                    defaultValue={item.email}
                                    mustBeValidEmailValidation
                                    error={Boolean(
                                      contactPeopleErrors?.email?.message,
                                    )}
                                    errorMessage={
                                      contactPeopleErrors?.email?.message
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`contactPeople[${index}].landLineNumber`}
                                    label={t('common:Land line number')}
                                    maxNumberOfCharacter={20}
                                    fieldRequired
                                    id="contact-land-line-number-input"
                                    defaultValue={item.landLineNumber}
                                    error={Boolean(
                                      contactPeopleErrors?.landLineNumber
                                        ?.message,
                                    )}
                                    errorMessage={
                                      contactPeopleErrors?.landLineNumber
                                        ?.message
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`contactPeople[${index}].phoneNumber`}
                                    label={t('common:Mobile phone number')}
                                    id="contact-phone-input"
                                    defaultValue={item.phoneNumber}
                                    error={Boolean(
                                      contactPeopleErrors?.phoneNumber?.message,
                                    )}
                                    errorMessage={
                                      contactPeopleErrors?.phoneNumber?.message
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="h6">
                            {t('common:Test details')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            {watchType === 82002 && (
                              <Grid item xs={12} md={6}>
                                <NumberControllerInput
                                  control={control}
                                  name="numberOfPools"
                                  label={t('common:Number of test classes')}
                                  id="number-of-test-classes-input"
                                  error={Boolean(errors.numberOfPools?.message)}
                                  errorMessage={errors.numberOfPools?.message}
                                />
                              </Grid>
                            )}
                            <Grid
                              item
                              xs={12}
                              md={watchType === 82002 ? 6 : 12}>
                              <NumberControllerInput
                                control={control}
                                name="numberOfSamples"
                                label={t('common:Number of test participants')}
                                id="number-of-test-participants-input"
                                fieldRequired
                                numberMustBePositive
                                error={Boolean(errors.numberOfSamples?.message)}
                                errorMessage={errors.numberOfSamples?.message}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </BasicFormWrapper>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="flex-end" spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={onCancelRegistration}>
                {t('common:Cancel')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(onSubmitForm)()}>
                {t('common:Next step')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </OrganizationRegistrationContainer>
  );
};

export default OrganizationRegistrationForm;
