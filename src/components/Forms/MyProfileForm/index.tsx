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
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  DeepMap,
  FieldError,
  useFieldArray,
  useForm,
  Controller,
} from 'react-hook-form';

// Material UI
import { Grid, Button, Typography, TextField } from '@material-ui/core';
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
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';

// Types
import {
  MyProfileUserType,
  PutGeneralMyProfileType,
} from 'redux/globalState/generalMyProfile/types';

// Actions
import { updateMyGeneralProfile } from 'redux/globalState/generalMyProfile/generalMyProfileSlice';

// Utils
import { RootState } from 'redux/combineReducers';

interface IMyProfileFormProps {
  removeAreaOfResponsibility?: boolean;
}

const MyProfileForm: React.FC<IMyProfileFormProps> = (
  props: IMyProfileFormProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { removeAreaOfResponsibility } = props;

  const generalMyPersonalData = useSelector(
    (state: RootState) => state.generalMyProfile.myPersonalData,
  );

  const generalMyProfileData = useSelector(
    (state: RootState) => state.generalMyProfile.myProfileData,
  );

  const organizationTypesList = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypes,
  );

  const convertedOrganizationTypesList = organizationTypesList.map(
    (orgType) => {
      return {
        organizationTypeId: orgType.id,
        organizationTypeName: orgType.name,
      };
    },
  );

  const updateGeneralMyProfileStatus = useSelector(
    (state: RootState) => state.generalMyProfile.updateGeneralMyProfileStatus,
  );

  const { control, handleSubmit, errors, setError } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      myPersonalData: {
        id: generalMyPersonalData.id,
        name: generalMyPersonalData.name,
        email: generalMyPersonalData.email,
        phoneNumber: generalMyPersonalData.phoneNumber || '',
        landLineNumber: generalMyPersonalData.landLineNumber,
        supportDefaultOrganizationTypes:
          generalMyPersonalData.supportDefaultOrganizationTypes || [],
      },
      myProfileData: {
        users: generalMyProfileData.users,
      },
    },
  });

  const usersFieldArray = useFieldArray({
    control,
    name: 'myProfileData.users',
    keyName: 'fieldKey',
  });

  const onSubmitGeneralMyProfileData = (values: any) => {
    const { myPersonalData, myProfileData } = values;
    const findSameEmailIndex = myProfileData.users.findIndex(
      (item: Record<string, unknown>, index: number): boolean => {
        if (item.email === myPersonalData.email) {
          return true;
        }
        for (let i = index + 1; i < myProfileData.users.length; i += 1) {
          if (item.email === myProfileData.users[i].email) {
            return true;
          }
        }
        return false;
      },
    );
    if (findSameEmailIndex !== -1) {
      setError(`myProfileData.users[${findSameEmailIndex}].email`, {
        type: 'manual',
        message: t('formValidation:This email address is already being used!'),
        shouldFocus: true,
      });
    } else {
      const data: PutGeneralMyProfileType = {
        id: generalMyProfileData.id,
        name: generalMyProfileData.name,
        roleType: generalMyProfileData.roleType,
        users: [{ ...myPersonalData }, ...myProfileData.users],
      };
      dispatch(updateMyGeneralProfile(data));
    }
  };

  const isLoading = updateGeneralMyProfileStatus.requesting;

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
                              disabled={isLoading}
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
                              disabled={isLoading}
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
                              disabled={isLoading}
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
                              disabled={isLoading}
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
                              disabled={isLoading}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            className={`${
                              removeAreaOfResponsibility && 'display-none'
                            }`}>
                            <Controller
                              control={control}
                              name={`myPersonalData.supportDefaultOrganizationTypes`}
                              render={({ ref, onChange, ...rest }) => {
                                return (
                                  <Autocomplete
                                    {...rest}
                                    multiple
                                    id="supportDefaultOrganizationTypes"
                                    options={convertedOrganizationTypesList}
                                    getOptionLabel={(option: any) => {
                                      if (option.organizationTypeName) {
                                        return t(
                                          `common:${option.organizationTypeName}`,
                                        );
                                      }
                                      return '';
                                    }}
                                    onChange={(event: any, newValue: any) => {
                                      onChange(newValue);
                                      return newValue;
                                    }}
                                    filterSelectedOptions
                                    renderOption={(option: any) => {
                                      if (option.organizationTypeName) {
                                        return (
                                          <span>
                                            {t(
                                              `common:${option.organizationTypeName}`,
                                            )}
                                          </span>
                                        );
                                      }
                                      return <span></span>;
                                    }}
                                    renderInput={(params) => {
                                      return (
                                        <TextField
                                          {...params}
                                          label={t(
                                            'common:Area of responsibility',
                                          )}
                                          variant="outlined"
                                          error={Boolean(
                                            errors.myPersonalData
                                              ?.supportDefaultOrganizationTypes
                                              ?.message,
                                          )}
                                          helperText={
                                            errors.myPersonalData
                                              ?.supportDefaultOrganizationTypes
                                              ?.message
                                          }
                                        />
                                      );
                                    }}
                                    disabled={isLoading}
                                  />
                                );
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    {usersFieldArray.fields.length !== 0 ? (
                      usersFieldArray.fields.map((item, index) => {
                        let usersErrors:
                          | DeepMap<MyProfileUserType, FieldError>
                          | undefined;
                        if (
                          errors?.myProfileData?.users &&
                          errors?.myProfileData?.users[index]
                        ) {
                          usersErrors = errors?.myProfileData?.users[index];
                        }

                        return (
                          <Grid key={item.id} container spacing={2}>
                            <Grid item xs={12}>
                              <Grid container justify="space-between">
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
                                      disabled={isLoading}
                                      onClick={() =>
                                        usersFieldArray.append({
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
                                    disabled={isLoading}
                                    onClick={() =>
                                      usersFieldArray.remove(index)
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
                                    defaultValue={item.id}
                                    name={`myProfileData.users[${index}].id`}
                                    label={t('common:id')}
                                    id="contact-person-id-input"
                                    hidden
                                    disabled={isLoading}
                                  />
                                  <TextControllerInput
                                    control={control}
                                    name={`myProfileData.users[${index}].name`}
                                    label={t('common:Name')}
                                    id="contact-person-input"
                                    defaultValue={item.name}
                                    fieldRequired
                                    error={Boolean(usersErrors?.name?.message)}
                                    errorMessage={usersErrors?.name?.message}
                                    disabled={isLoading}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`myProfileData.users[${index}].email`}
                                    label={t('common:Email')}
                                    id="contact-email-input"
                                    defaultValue={item.email}
                                    mustBeValidEmailValidation
                                    fieldRequired
                                    error={Boolean(usersErrors?.email?.message)}
                                    errorMessage={usersErrors?.email?.message}
                                    disabled={isLoading}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`myProfileData.users[${index}].landLineNumber`}
                                    label={t('common:Land line number')}
                                    id="contact-land-phone-input"
                                    maxNumberOfCharacter={20}
                                    fieldRequired
                                    defaultValue={item.landLineNumber}
                                    error={Boolean(
                                      usersErrors?.landLineNumber?.message,
                                    )}
                                    errorMessage={
                                      usersErrors?.landLineNumber?.message
                                    }
                                    disabled={isLoading}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextControllerInput
                                    control={control}
                                    name={`myProfileData.users[${index}].phoneNumber`}
                                    label={t('common:Mobile phone number')}
                                    id="contact-phone-input"
                                    defaultValue={item.phoneNumber || ''}
                                    error={Boolean(
                                      usersErrors?.phoneNumber?.message,
                                    )}
                                    errorMessage={
                                      usersErrors?.phoneNumber?.message
                                    }
                                    disabled={isLoading}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  className={`${
                                    removeAreaOfResponsibility && 'display-none'
                                  }`}>
                                  <Controller
                                    control={control}
                                    name={`myProfileData.users[${index}].supportDefaultOrganizationTypes`}
                                    defaultValue={
                                      item.supportDefaultOrganizationTypes
                                    }
                                    render={({ ref, onChange, ...rest }) => {
                                      return (
                                        <Autocomplete
                                          {...rest}
                                          multiple
                                          id="supportDefaultOrganizationTypes"
                                          options={
                                            convertedOrganizationTypesList
                                          }
                                          getOptionLabel={(option: any) => {
                                            if (option.organizationTypeName) {
                                              return t(
                                                `common:${option.organizationTypeName}`,
                                              );
                                            }
                                            return '';
                                          }}
                                          getOptionSelected={(
                                            option,
                                            value,
                                          ) => {
                                            return Boolean(
                                              option.organizationTypeId ===
                                                value.organizationTypeId,
                                            );
                                          }}
                                          onChange={(
                                            event: any,
                                            newValue: any,
                                          ) => {
                                            onChange(newValue);
                                            return newValue;
                                          }}
                                          filterSelectedOptions
                                          renderOption={(option: any) => {
                                            if (option.organizationTypeName) {
                                              return (
                                                <span>
                                                  {t(
                                                    `common:${option.organizationTypeName}`,
                                                  )}
                                                </span>
                                              );
                                            }
                                            return <span></span>;
                                          }}
                                          renderInput={(params) => {
                                            return (
                                              <TextField
                                                {...params}
                                                label={t(
                                                  'common:Area of responsibility',
                                                )}
                                                variant="outlined"
                                                error={Boolean(
                                                  errors
                                                    .supportDefaultOrganizationTypes
                                                    ?.message,
                                                )}
                                                helperText={
                                                  errors
                                                    .supportDefaultOrganizationTypes
                                                    ?.message
                                                }
                                              />
                                            );
                                          }}
                                          disabled={isLoading}
                                        />
                                      );
                                    }}
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
                                disabled={isLoading}
                                onClick={() =>
                                  usersFieldArray.append({
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
                    <Grid container justify="flex-end">
                      <Grid item>
                        <ButtonWithLoadingAnimation
                          variant="contained"
                          color="primary"
                          isLoading={isLoading}
                          onClick={() =>
                            handleSubmit(onSubmitGeneralMyProfileData)()
                          }
                          text={t('common:Save changes')}
                        />
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

export default MyProfileForm;
