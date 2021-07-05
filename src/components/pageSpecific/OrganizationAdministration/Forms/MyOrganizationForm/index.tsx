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
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Controller,
  DeepMap,
  FieldError,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';

// Material UI
import {
  MenuItem,
  Grid,
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Material Icons
import {
  AddCircleOutline as AddCircleOutlineIcon,
  DeleteOutline as DeleteOutlineIcon,
} from '@material-ui/icons';

// Custom components
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import Card from 'components/Card';
import TextControllerInput from 'components/FormControllerInputs/TextControllerInput';
import NumberControllerInput from 'components/FormControllerInputs/NumberControlInput';
import DropdownControllerInput from 'components/FormControllerInputs/DropdownControlInput';

// Types
import { ContactPersonType, OrganizationTypeType } from 'redux/globalTypes';
import { PutOrganizationType } from 'redux/organizationAdministration/organizationAdministrationMyProfile/types';
import { CityType } from 'redux/globalState/citiesData/types';

// Form validations
import { fieldRequired } from 'formValidation';

// Utils
import { RootState } from 'redux/combineReducers';
import { updateMyOrganization } from 'redux/organizationAdministration/organizationAdministrationMyProfile/organizationAdministrationMyProfileSlice';
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';

const MyOrganizationForm: React.FC = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const organizationData = useSelector(
    (state: RootState) =>
      state.organizationAdministrationMyProfileData.organizationData,
  );

  const myPersonalDataRedux = useSelector(
    (state: RootState) =>
      state.organizationAdministrationMyProfileData.personalData,
  );

  const updateOrganizationStatus = useSelector(
    (state: RootState) =>
      state.organizationAdministrationMyProfileData.updateOrganizationStatus,
  );

  const citiesList = useSelector((state: RootState) => state.cities.cities);

  const organizationTypesList = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypes,
  );

  const {
    control,
    handleSubmit,
    setValue,
    errors,
    setError,
    watch,
  } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      myPersonalData: {
        id: myPersonalDataRedux.id,
        name: myPersonalDataRedux.name,
        email: myPersonalDataRedux.email,
        phoneNumber: myPersonalDataRedux.phoneNumber || '',
        landLineNumber: myPersonalDataRedux.landLineNumber,
      },
      myOrganizationData: {
        organizationName: organizationData.name,
        type: organizationData.organizationTypeId || '',
        city:
          citiesList.find((city) => city.id === organizationData.cityId) || '',
        ZIP: organizationData.ZIP || '',
        contactPeople: organizationData.contacts || [],
        numberOfSamples: organizationData.numberOfSamples,
        numberOfPools: organizationData.numberOfPools,
        addressForPickupAndDelivery: organizationData.address,
      },
    },
  });

  const contactPeopleFieldArray = useFieldArray({
    control,
    name: 'myOrganizationData.contactPeople',
    keyName: 'formId',
  });

  const watchCity = watch('myOrganizationData').city;
  const watchType = watch('myOrganizationData').type;

  useEffect(() => {
    if (watchCity) {
      setValue('myOrganizationData.ZIP', watchCity.zipCode, {
        shouldValidate: true,
      });
    } else {
      setValue('myOrganizationData.ZIP', '');
    }
  }, [watchCity]);

  const onSubmitMyOrganizationData: SubmitHandler<any> = (values) => {
    const { myPersonalData, myOrganizationData } = values;

    const updatedContactPeople =
      myOrganizationData.contactPeople.map(
        (contactPerson: ContactPersonType) => {
          const person: ContactPersonType = {
            name: contactPerson.name,
            email: contactPerson.email,
            phoneNumber: contactPerson.phoneNumber,
            landLineNumber: contactPerson.landLineNumber,
          };
          if (contactPerson.id) {
            person.id = contactPerson.id;
          }
          return person;
        },
      ) || [];
    const findSameEmailIndex = updatedContactPeople.findIndex(
      (item: Record<string, unknown>, index: number): boolean => {
        if (item.email === myPersonalData.email) {
          return true;
        }
        for (let i = index + 1; i < updatedContactPeople.length; i += 1) {
          if (item.email === updatedContactPeople[i].email) {
            return true;
          }
        }
        return false;
      },
    );
    if (findSameEmailIndex !== -1) {
      setError(
        `myOrganizationData.contactPeople[${findSameEmailIndex}].email`,
        {
          type: 'manual',
          message: t(
            'formValidation:This email address is already being used!',
          ),
          shouldFocus: true,
        },
      );
    } else {
      const combinedOrganizationData: PutOrganizationType = {
        id: organizationData.id,
        name: organizationData.name,
        typeId: myOrganizationData.type,
        cityId: myOrganizationData.city.id,
        ZIP: myOrganizationData.ZIP,
        numberOfSamples: parseInt(myOrganizationData.numberOfSamples, 10) || 0,
        numberOfPools: parseInt(myOrganizationData.numberOfPools, 10) || null,
        address: myOrganizationData.addressForPickupAndDelivery,
        contacts: [{ ...myPersonalData }, ...updatedContactPeople],
        supportPersonId: organizationData.supportPersonId,
      };
      dispatch(updateMyOrganization(combinedOrganizationData));
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <Grid container>
            <Grid item xs={12}>
              <BasicFormWrapper>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          {t('common:My personal information')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextControllerInput
                              control={control}
                              name="myPersonalData.id"
                              label={t('common:id')}
                              id="contact-person-id-input"
                              hidden
                              disabled={updateOrganizationStatus.requesting}
                            />
                            <TextControllerInput
                              control={control}
                              name="myPersonalData.name"
                              label={t('common:Name')}
                              id="my-personal-name-input"
                              fieldRequired
                              error={Boolean(
                                errors?.myPersonalData?.name?.message,
                              )}
                              errorMessage={
                                errors?.myPersonalData?.name?.message
                              }
                              disabled={updateOrganizationStatus.requesting}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextControllerInput
                              control={control}
                              name="myPersonalData.email"
                              label={t('common:Email')}
                              id="my-personal-email-input"
                              fieldRequired
                              mustBeValidEmailValidation
                              error={Boolean(
                                errors?.myPersonalData?.email?.message,
                              )}
                              errorMessage={
                                errors?.myPersonalData?.email?.message
                              }
                              disabled={updateOrganizationStatus.requesting}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextControllerInput
                              control={control}
                              name="myPersonalData.landLineNumber"
                              label={t('common:Land line number')}
                              id="my-personal-landLineNumber-input"
                              maxNumberOfCharacter={20}
                              fieldRequired
                              error={Boolean(
                                errors?.myPersonalData?.landLineNumber?.message,
                              )}
                              errorMessage={
                                errors?.myPersonalData?.landLineNumber?.message
                              }
                              disabled={updateOrganizationStatus.requesting}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextControllerInput
                              control={control}
                              name="myPersonalData.phoneNumber"
                              label={t('common:Mobile phone number')}
                              id="my-personal-phoneNumber-input"
                              error={Boolean(
                                errors?.myPersonalData?.phoneNumber?.message,
                              )}
                              errorMessage={
                                errors?.myPersonalData?.phoneNumber?.message
                              }
                              disabled={updateOrganizationStatus.requesting}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          {t('common:My organization')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextControllerInput
                              control={control}
                              name="myOrganizationData.organizationName"
                              label={t('common:Organization name')}
                              id="organization-name-input"
                              fieldRequired
                              error={Boolean(
                                errors?.myOrganizationData?.organizationName
                                  ?.message,
                              )}
                              errorMessage={
                                errors?.myOrganizationData?.organizationName
                                  ?.message
                              }
                              disabled={updateOrganizationStatus.requesting}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <DropdownControllerInput
                              control={control}
                              name="myOrganizationData.type"
                              label={t('common:Type')}
                              labelId="type"
                              id="organization-type-select"
                              fieldRequired
                              error={Boolean(
                                errors?.myOrganizationData?.type?.message,
                              )}
                              errorMessage={
                                errors?.myOrganizationData?.type?.message
                              }
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
                              disabled={updateOrganizationStatus.requesting}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Controller
                              control={control}
                              name="myOrganizationData.city"
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
                                        <Grid container justify="space-between">
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
                                            errors?.myOrganizationData?.city
                                              ?.message,
                                          )}
                                          helperText={
                                            Boolean(
                                              errors?.myOrganizationData?.city
                                                ?.message,
                                            )
                                              ? t(
                                                  `formValidation:${errors?.myOrganizationData?.city?.message}`,
                                                )
                                              : ''
                                          }
                                        />
                                      );
                                    }}
                                    disabled={
                                      updateOrganizationStatus.requesting
                                    }
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
                              name="myOrganizationData.addressForPickupAndDelivery"
                              label={t(
                                'common:Address for pickup and delivery',
                              )}
                              id="address-for-pickup-and-delivery-input"
                              fieldRequired
                              error={Boolean(
                                errors?.myOrganizationData
                                  ?.addressForPickupAndDelivery?.message,
                              )}
                              errorMessage={
                                errors?.myOrganizationData
                                  ?.addressForPickupAndDelivery?.message
                              }
                              disabled={updateOrganizationStatus.requesting}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextControllerInput
                              control={control}
                              name="myOrganizationData.ZIP"
                              label={t('common:ZIP')}
                              id="zip-code-input"
                              fieldRequired
                              error={Boolean(
                                errors?.myOrganizationData?.ZIP?.message,
                              )}
                              errorMessage={
                                errors?.myOrganizationData?.ZIP?.message
                              }
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    {contactPeopleFieldArray.fields.length !== 0 ? (
                      contactPeopleFieldArray.fields.map((item, index) => {
                        let contactPeopleErrors:
                          | DeepMap<ContactPersonType, FieldError>
                          | undefined;
                        if (
                          errors?.myOrganizationData?.contactPeople &&
                          errors?.myOrganizationData?.contactPeople[index]
                        ) {
                          contactPeopleErrors =
                            errors?.myOrganizationData?.contactPeople[index];
                        }

                        return (
                          <Grid key={item.formId} container spacing={2}>
                            <Grid item xs={12}>
                              <Grid
                                container
                                justify="space-between"
                                spacing={2}>
                                <Grid item>
                                  <Typography variant="h6">
                                    {`${t(
                                      'common:Additional contact person',
                                    )} ${index >= 1 ? index + 1 : ''}`}
                                  </Typography>
                                </Grid>
                                {index <= 0 && (
                                  <Grid item>
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
                                  </Grid>
                                )}
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container justify="flex-end">
                                <Grid item>
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
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={12}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`myOrganizationData.contactPeople[${index}].id`}
                                    defaultValue={item.id || ''}
                                    label={t('common:Name')}
                                    id="contact-person-input"
                                    hidden
                                    disabled={
                                      updateOrganizationStatus.requesting
                                    }
                                  />
                                  <TextControllerInput
                                    control={control}
                                    name={`myOrganizationData.contactPeople[${index}].name`}
                                    defaultValue={item.name}
                                    label={t('common:Name')}
                                    fieldRequired
                                    id="contact-person-input"
                                    error={Boolean(
                                      contactPeopleErrors?.name?.message,
                                    )}
                                    errorMessage={
                                      contactPeopleErrors?.name?.message
                                    }
                                    disabled={
                                      updateOrganizationStatus.requesting
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`myOrganizationData.contactPeople[${index}].email`}
                                    mustBeValidEmailValidation
                                    defaultValue={item.email}
                                    label={t('common:Email')}
                                    fieldRequired
                                    id="contact-email-input"
                                    error={Boolean(
                                      contactPeopleErrors?.email?.message,
                                    )}
                                    errorMessage={
                                      contactPeopleErrors?.email?.message
                                    }
                                    disabled={
                                      updateOrganizationStatus.requesting
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
                                    name={`myOrganizationData.contactPeople[${index}].landLineNumber`}
                                    defaultValue={item.landLineNumber}
                                    label={t('common:Land line number')}
                                    id="contact-land-phone-input"
                                    maxNumberOfCharacter={20}
                                    fieldRequired
                                    error={Boolean(
                                      contactPeopleErrors?.landLineNumber
                                        ?.message,
                                    )}
                                    errorMessage={
                                      contactPeopleErrors?.landLineNumber
                                        ?.message
                                    }
                                    disabled={
                                      updateOrganizationStatus.requesting
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`myOrganizationData.contactPeople[${index}].phoneNumber`}
                                    defaultValue={item.phoneNumber || ''}
                                    label={t('common:Mobile phone number')}
                                    id="contact-phone-input"
                                    error={Boolean(
                                      contactPeopleErrors?.phoneNumber?.message,
                                    )}
                                    errorMessage={
                                      contactPeopleErrors?.phoneNumber?.message
                                    }
                                    disabled={
                                      updateOrganizationStatus.requesting
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })
                    ) : (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Grid container justify="space-between">
                            <Grid item>
                              <Typography variant="h6">
                                {t('common:Contact person')}
                              </Typography>
                            </Grid>
                            <Grid item>
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
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            {t('common:No contact person')}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
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
                                name="myOrganizationData.numberOfSamples"
                                label={t('common:Number of test classes')}
                                id="number-of-test-classes-input"
                                error={Boolean(
                                  errors?.myOrganizationData?.numberOfSamples
                                    ?.message,
                                )}
                                errorMessage={
                                  errors?.myOrganizationData?.numberOfSamples
                                    ?.message
                                }
                                disabled={updateOrganizationStatus.requesting}
                              />
                            </Grid>
                          )}
                          <Grid item xs={12} md={watchType === 82002 ? 6 : 12}>
                            <NumberControllerInput
                              control={control}
                              name="myOrganizationData.numberOfPools"
                              label={t('common:Number of test participants')}
                              id="number-of-test-participants-input"
                              error={Boolean(
                                errors?.myOrganizationData?.numberOfPools
                                  ?.message,
                              )}
                              errorMessage={
                                errors?.myOrganizationData?.numberOfPools
                                  ?.message
                              }
                              disabled={updateOrganizationStatus.requesting}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container justify="flex-end">
                          <Grid item>
                            <ButtonWithLoadingAnimation
                              variant="contained"
                              color="primary"
                              isLoading={updateOrganizationStatus.requesting}
                              onClick={() =>
                                handleSubmit(onSubmitMyOrganizationData)()
                              }
                              text={t('common:Save changes')}
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
    </Grid>
  );
};

export default MyOrganizationForm;
