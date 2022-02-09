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

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Controller,
  DeepMap,
  FieldError,
  useFieldArray,
  useForm,
} from 'react-hook-form';

// Material UI
import {
  Grid,
  MenuItem,
  Button,
  TextField,
  Typography,
  Portal,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Material Icons
import {
  AddCircleOutline as AddCircleOutlineIcon,
  DeleteOutline as DeleteOutlineIcon,
} from '@material-ui/icons';

// Custom components
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import TextControllerInput from 'components/FormControllerInputs/TextControllerInput';
import NumberControllerInput from 'components/FormControllerInputs/NumberControlInput';
import DropdownControllerInput from 'components/FormControllerInputs/DropdownControlInput';
import Card from 'components/Card';
import DatePickerControllerInput from 'components/FormControllerInputs/DatePickerControlInput';
import DateAndTimePickerControllerInput from 'components/FormControllerInputs/DateAndTimePickerControllerInput';
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';
import Notes from 'components/Notes/index';

// Actions
import {
  getSupportPeople,
  updateProgramMember,
  clearUpdateProgramData,
  getProgramMember,
} from 'redux/onboardingAndTrainingAdministration/EditProgramMember/editProgramMemberSlice';

// Routes
import { OnboardingAndTrainingAdministrationRoutes } from 'config/routes';

// Types
import { CityType } from 'redux/globalState/citiesData/types';
import { PutProgramMemberType } from 'redux/onboardingAndTrainingAdministration/EditProgramMember/types';
import {
  ContactPersonType,
  OrganizationTypeType,
  SupportPersonSelectType,
} from 'redux/globalTypes';

// Utils
import { findCity } from 'utils/findCity';
import { RootState } from 'redux/combineReducers';
import programMemberStatusEnum from 'utils/programMemberStatusEnum';
import {
  convertDateWithoutTime,
  convertStringDateToDate,
  convertDateTimeInUTCFormat,
} from 'utils/dateFNSCustom';
import organizationTypesEnum from 'utils/organizationTypesEnum';

// Form validations
import { fieldRequired } from 'formValidation';

const schoolsTypes = [
  {
    id: 'Berufsfachschule',
    name: 'Vocational School',
  },
  {
    id: 'Mittelschule',
    name: 'Middle School',
  },
  {
    id: 'Primarstufe',
    name: 'Primary School',
  },
  {
    id: 'Privatschule',
    name: 'Private School',
  },
  {
    id: 'Sekundarstufe',
    name: 'Secondary Level School',
  },
];

type EditProgramMemberFormTypes = {
  onOpenFollowUpModal: () => void;
  disableFollowUpModal: () => void;
};

const EditProgramMemberForm: React.FC<EditProgramMemberFormTypes> = (
  props: EditProgramMemberFormTypes,
) => {
  const { onOpenFollowUpModal, disableFollowUpModal } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const notesPortalRef = useRef(null);

  const [
    initialGetSupportPerson,
    setInitialGetSupportPerson,
  ] = useState<boolean>(false);

  const [onSaveRedirect, setOnSaveRedirect] = useState<boolean>(false);

  const [isNotesExpanded, setNotesExpanded] = useState<boolean>(false);

  const citiesList = useSelector((state: RootState) => state.cities.cities);

  const organizationTypesList = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypes,
  );

  const programMember = useSelector(
    (state: RootState) => state.editProgramMemberData.programMember,
  );

  const supportPeopleStatus = useSelector(
    (state: RootState) => state.editProgramMemberData.supportPeopleStatus,
  );

  const supportPeople = useSelector(
    (state: RootState) => state.editProgramMemberData.supportPeople,
  );

  const updateProgramMemberStatus = useSelector(
    (state: RootState) => state.editProgramMemberData.updateProgramMemberStatus,
  );

  const onCancelEditProgramMemberForm = () => {
    history.push(OnboardingAndTrainingAdministrationRoutes.overviewRoute.route);
  };

  const {
    control,
    handleSubmit,
    errors,
    watch,
    setValue,
    clearErrors,
    setError,
  } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      name: programMember?.name || '',
      organizationTypeId: programMember?.organizationTypeId || '',
      city: findCity(citiesList, programMember?.cityId) || '',
      zip: programMember?.zip || '',
      address: programMember?.address || '',
      trainingTimestamp:
        convertStringDateToDate(programMember?.trainingTimestamp) || '',
      onboardingTimestamp:
        convertStringDateToDate(programMember?.onboardingTimestamp) || null,
      firstTestTimestamp:
        convertStringDateToDate(programMember?.firstTestTimestamp) || '',
      secondTestTimestamp:
        convertStringDateToDate(programMember?.secondTestTimestamp) || '',
      thirdTestTimestamp:
        convertStringDateToDate(programMember?.thirdTestTimestamp) || '',
      fourthTestTimestamp:
        convertStringDateToDate(programMember?.fourthTestTimestamp) || '',
      fifthTestTimestamp:
        convertStringDateToDate(programMember?.fifthTestTimestamp) || '',
      exclusionStartDate:
        convertStringDateToDate(programMember?.exclusionStartDate) || '',
      exclusionEndDate:
        convertStringDateToDate(programMember?.exclusionEndDate) || '',
      numberOfSamples: programMember?.numberOfSamples || '',
      numberOfPools: programMember?.numberOfPools || '',
      supportPersonId: programMember?.supportPersonId || '',
      manager: programMember?.manager || '',
      studentsCount: programMember?.studentsCount || '',
      employeesCount: programMember?.employeesCount || '',
      area: programMember?.area || '',
      county: programMember?.county || '',
      prioLogistic: programMember?.prioLogistic || '',
      schoolType: programMember?.schoolType || '',
      numberOfBags: programMember?.numberOfBags || '',
      naclLosing: programMember?.naclLosing || '',
      additionalTestTubes: programMember?.additionalTestTubes || '',
      numberOfRakoBoxes: programMember?.numberOfRakoBoxes || '',
      pickupLocation: programMember?.pickupLocation || '',
      contacts: programMember?.contacts || [],
      organizationShortcutName: programMember?.organizationShortcutName || '',
      reportingContact: programMember?.ReportingContact || '',
      reportingEmail: programMember?.ReportingEmail || '',
    },
  });

  const contactsFieldArray = useFieldArray({
    control,
    name: 'contacts',
    keyName: 'contactsFormId',
  });

  const watchCity = watch('city');
  const watchOrganizationTypeId = watch('organizationTypeId');
  const watchExclusionStartDate = watch('exclusionStartDate');
  const watchExclusionEndDate = watch('exclusionEndDate');

  useEffect(() => {
    return () => {
      dispatch(clearUpdateProgramData());
    };
  }, []);

  useEffect(() => {
    if (
      (watchExclusionStartDate && watchExclusionEndDate) ||
      (!watchExclusionStartDate && !watchExclusionEndDate)
    ) {
      clearErrors(['exclusionStartDate', 'exclusionEndDate']);
    }
    if (watchExclusionStartDate && !watchExclusionEndDate) {
      setError('exclusionEndDate', {
        type: 'manual',
        message: t('formValidation:Field is required!'),
        shouldFocus: true,
      });
    }
    if (!watchExclusionStartDate && watchExclusionEndDate) {
      setError('exclusionStartDate', {
        type: 'manual',
        message: t('formValidation:Field is required!'),
        shouldFocus: true,
      });
    }
  }, [watchExclusionStartDate, watchExclusionEndDate]);

  useEffect(() => {
    if (watchCity) {
      setValue('ZIP', watchCity.zipCode, {
        shouldValidate: true,
      });
    } else {
      setValue('ZIP', '');
    }
  }, [watchCity]);

  useEffect(() => {
    if (watchOrganizationTypeId) {
      dispatch(
        getSupportPeople({
          organizationTypeId: watchOrganizationTypeId,
        }),
      );
    }
  }, [watchOrganizationTypeId]);

  useEffect(() => {
    if (supportPeopleStatus.requesting) {
      if (initialGetSupportPerson) {
        setValue('supportPersonId', '', {
          shouldValidate: true,
        });
        setValue('schoolType', '');
      } else {
        setInitialGetSupportPerson(true);
      }
    }
  }, [supportPeopleStatus.requesting]);

  useEffect(() => {
    if (updateProgramMemberStatus.success) {
      if (onSaveRedirect) {
        history.push(
          OnboardingAndTrainingAdministrationRoutes.overviewRoute.route,
        );
      } else {
        dispatch(getProgramMember(programMember.id));
      }
    }
  }, [updateProgramMemberStatus]);

  useEffect(() => {
    const locState: any = location.state;
    if (locState?.openFollowUpModal && !programMember.isOnboardingEmailSent) {
      switch (programMember.organizationTypeId) {
        case organizationTypesEnum.SME: {
          let openFollowUpModal = true;
          if (!Boolean(programMember.area)) {
            setError('area', {
              type: 'manual',
              message: t('formValidation:Field is required!'),
            });
            openFollowUpModal = false;
            disableFollowUpModal();
          }
          // if (!Boolean(programMember.organizationShortcutName)) {
          //   setError('organizationShortcutName', {
          //     type: 'manual',
          //     message: t('formValidation:Field is required!'),
          //   });
          //   openFollowUpModal = false;
          //   disableFollowUpModal();
          // }
          if (!Boolean(programMember.firstTestTimestamp)) {
            setError('firstTestTimestamp', {
              type: 'manual',
              message: t('formValidation:Field is required!'),
            });
            openFollowUpModal = false;
            disableFollowUpModal();
          }
          if (openFollowUpModal) {
            onOpenFollowUpModal();
          }
          break;
        }
        case organizationTypesEnum.Company: {
          let openFollowUpModal = true;
          if (!Boolean(programMember.supportPersonId)) {
            setError('supportPersonId', {
              type: 'manual',
              message: t('formValidation:Field is required!'),
            });
            openFollowUpModal = false;
            disableFollowUpModal();
          }
          // if (!Boolean(programMember.organizationShortcutName)) {
          //   setError('organizationShortcutName', {
          //     type: 'manual',
          //     message: t('formValidation:Field is required!'),
          //   });
          //   openFollowUpModal = false;
          //   disableFollowUpModal();
          // }
          if (openFollowUpModal) {
            onOpenFollowUpModal();
          }
          break;
        }
        default: {
          console.log();
        }
      }
    }
  }, [location]);

  const addNewContactPersonFieldArray = () => {
    contactsFieldArray.append({
      name: '',
      email: '',
      phoneNumber: '',
      landLineNumber: '',
    });
  };

  const onSubmitForm = (values: any) => {
    if (values.exclusionStartDate && !values.exclusionEndDate) {
      setError('exclusionEndDate', {
        type: 'manual',
        message: t('formValidation:Field is required!'),
        shouldFocus: true,
      });
    } else if (!values.exclusionStartDate && values.exclusionEndDate) {
      setError('exclusionStartDate', {
        type: 'manual',
        message: t('formValidation:Field is required!'),
        shouldFocus: true,
      });
    } else if (!values.contacts || values?.contacts?.length === 0) {
      addNewContactPersonFieldArray();
    } else {
      const data: PutProgramMemberType = {
        name: values.name,
        organizationTypeId: values.organizationTypeId,
        cityId: values.city.id,
        zip: values.zip,
        address: values.address,
        trainingTimestamp: convertDateWithoutTime(values.trainingTimestamp),
        onboardingTimestamp: convertDateTimeInUTCFormat(
          values.onboardingTimestamp,
        ),
        firstTestTimestamp: convertDateWithoutTime(values.firstTestTimestamp),
        secondTestTimestamp: convertDateWithoutTime(values.secondTestTimestamp),
        thirdTestTimestamp: convertDateWithoutTime(values.thirdTestTimestamp),
        fourthTestTimestamp: convertDateWithoutTime(values.fourthTestTimestamp),
        fifthTestTimestamp: convertDateWithoutTime(values.fifthTestTimestamp),
        exclusionStartDate: convertDateWithoutTime(values.exclusionStartDate),
        exclusionEndDate: convertDateWithoutTime(values.exclusionEndDate),
        numberOfSamples: parseInt(values.numberOfSamples, 10) || 0,
        numberOfPools: parseInt(values.numberOfPools, 10) || null,
        supportPersonId: values.supportPersonId,
        manager: values.manager,
        studentsCount: values.studentsCount,
        employeesCount: values.employeesCount,
        area: values.area,
        county: values.county,
        prioLogistic: values.prioLogistic,
        schoolType: values.schoolType,
        numberOfBags: values.numberOfBags,
        naclLosing: values.naclLosing,
        additionalTestTubes: values.additionalTestTubes,
        numberOfRakoBoxes: values.numberOfRakoBoxes,
        pickupLocation: values.pickupLocation,
        contacts: values?.contacts,
        subOrganizations: programMember?.subOrganizations,
        id: programMember?.id,
        status: programMember?.status,
        registeredEmployees: programMember?.registeredEmployees,
        organizationShortcutName: values?.organizationShortcutName,
        ReportingContact: values?.reportingContact,
        ReportingEmail: values?.reportingEmail,
      };
      dispatch(updateProgramMember(data));
    }
  };

  const isReadOnly = programMember.status === programMemberStatusEnum.NotActive;
  const registeredEmployees = programMember?.registeredEmployees || 0;
  const disableShortCutField = Boolean(registeredEmployees);
  const disableOrgType = Boolean(registeredEmployees);
  const isUpdating = updateProgramMemberStatus.requesting;

  return (
    <>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          className="overflow-auto"
          style={{ height: 'calc(100vh - 240px)' }}>
          <BasicFormWrapper>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Card>
                  <Grid container spacing={2} className="relative">
                    <Grid item xs={12} md={6} lg={3}>
                      <Grid
                        container
                        direction="column"
                        spacing={2}
                        className="grid-column-items-full-width">
                        <Grid item>
                          <Typography variant="h6">
                            {t('common:General information')}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <TextControllerInput
                            control={control}
                            name="name"
                            label={t('common:Name')}
                            id="name-input"
                            fieldRequired
                            maxNumberOfCharacter={100}
                            error={Boolean(errors?.name?.message)}
                            errorMessage={errors?.name?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DropdownControllerInput
                            control={control}
                            name="organizationTypeId"
                            label={t('common:Organization type')}
                            labelId="type"
                            id="organization-type-select"
                            fieldRequired
                            error={Boolean(errors?.organizationTypeId?.message)}
                            errorMessage={errors?.organizationTypeId?.message}
                            menuItems={organizationTypesList?.map(
                              (orgType: OrganizationTypeType) => {
                                return (
                                  <MenuItem key={orgType.id} value={orgType.id}>
                                    {t(`common:${orgType.name}`)}
                                  </MenuItem>
                                );
                              },
                            )}
                            disabled={
                              isUpdating || isReadOnly || disableOrgType
                            }
                          />
                        </Grid>
                        <Grid item>
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
                                    return optionSelected?.name ? true : false;
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
                                        error={Boolean(errors?.city?.message)}
                                        helperText={
                                          Boolean(errors?.city?.message)
                                            ? t(
                                                `formValidation:${errors?.city?.message}`,
                                              )
                                            : ''
                                        }
                                      />
                                    );
                                  }}
                                  disabled={isUpdating || isReadOnly}
                                />
                              );
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <TextControllerInput
                            control={control}
                            name="zip"
                            label={t('common:ZIP')}
                            id="zip-code-input"
                            fieldRequired
                            error={Boolean(errors?.zip?.message)}
                            errorMessage={errors?.zip?.message}
                            disabled
                          />
                        </Grid>
                        <Grid item>
                          <TextControllerInput
                            control={control}
                            name="address"
                            label={t('common:Address for pickup and delivery')}
                            id="address-for-pickup-and-delivery-input"
                            fieldRequired
                            error={Boolean(errors?.address?.message)}
                            errorMessage={errors?.address?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <TextControllerInput
                            control={control}
                            name="manager"
                            label={t('common:Manager')}
                            id="manager-input"
                            error={Boolean(errors?.manager?.message)}
                            errorMessage={errors?.manager?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <TextControllerInput
                            control={control}
                            name="area"
                            label={t('common:Area')}
                            id="area-input"
                            error={Boolean(errors?.area?.message)}
                            errorMessage={errors?.area?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <TextControllerInput
                            control={control}
                            name="county"
                            label={t('common:County')}
                            id="county-input"
                            error={Boolean(errors?.county?.message)}
                            errorMessage={errors?.county?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid
                          item
                          className={`${
                            Boolean(watchOrganizationTypeId !== 82002) &&
                            'display-none'
                          }`}>
                          <DropdownControllerInput
                            control={control}
                            name="schoolType"
                            label={t('common:School type')}
                            labelId="type"
                            fieldRequired={Boolean(
                              watchOrganizationTypeId === 82002, // schoolType
                            )}
                            id="school-type-select"
                            error={Boolean(errors?.schoolType?.message)}
                            errorMessage={errors?.schoolType?.message}
                            menuItems={schoolsTypes.map((schoolType) => {
                              return (
                                <MenuItem
                                  key={schoolType.id}
                                  value={schoolType.id}>
                                  {t(`common:${schoolType.name}`)}
                                </MenuItem>
                              );
                            })}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DropdownControllerInput
                            control={control}
                            name="supportPersonId"
                            label={t('common:Support person')}
                            labelId="type"
                            id="support-person-select"
                            fieldRequired
                            error={Boolean(errors?.supportPersonId?.message)}
                            errorMessage={errors?.supportPersonId?.message}
                            menuItems={supportPeople?.map(
                              (supportPerson: SupportPersonSelectType) => {
                                return (
                                  <MenuItem
                                    key={supportPerson.supportPersonId}
                                    value={supportPerson.supportPersonId}>
                                    {supportPerson.name}
                                  </MenuItem>
                                );
                              },
                            )}
                            showLoadingEndAdornment={
                              supportPeopleStatus.requesting
                            }
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <TextControllerInput
                            control={control}
                            name="organizationShortcutName"
                            label={t('common:Organization key')}
                            id="organizationShortcutName-input"
                            error={Boolean(
                              errors?.organizationShortcutName?.message,
                            )}
                            errorMessage={
                              errors?.organizationShortcutName?.message
                            }
                            disabled={
                              isUpdating || isReadOnly || disableShortCutField
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <Typography variant="h6">
                            {t('common:Dates')}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <DatePickerControllerInput
                            control={control}
                            name="trainingTimestamp"
                            label={t('common:Information event date')}
                            id="trainingTimestamp-date-input"
                            error={Boolean(errors?.trainingTimestamp?.message)}
                            errorMessage={errors?.trainingTimestamp?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DateAndTimePickerControllerInput
                            control={control}
                            name="onboardingTimestamp"
                            label={t('common:Onboarding date')}
                            id="onboardingTimestamp-date-input"
                            error={Boolean(
                              errors?.onboardingTimestamp?.message,
                            )}
                            errorMessage={errors?.onboardingTimestamp?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DatePickerControllerInput
                            control={control}
                            name="firstTestTimestamp"
                            label={t('common:First testing date')}
                            id="firstTestTimestamp-date-input"
                            error={Boolean(errors?.firstTestTimestamp?.message)}
                            errorMessage={errors?.firstTestTimestamp?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DatePickerControllerInput
                            control={control}
                            name="secondTestTimestamp"
                            label={t('common:Second testing date')}
                            id="secondTestTimestamp-date-input"
                            error={Boolean(
                              errors?.secondTestTimestamp?.message,
                            )}
                            errorMessage={errors?.secondTestTimestamp?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DatePickerControllerInput
                            control={control}
                            name="thirdTestTimestamp"
                            label={t('common:Third testing date')}
                            id="thirdTestTimestamp-date-input"
                            error={Boolean(errors?.thirdTestTimestamp?.message)}
                            errorMessage={errors?.thirdTestTimestamp?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DatePickerControllerInput
                            control={control}
                            name="fourthTestTimestamp"
                            label={t('common:Fourth testing date')}
                            id="fourthTestTimestamp-date-input"
                            error={Boolean(
                              errors?.fourthTestTimestamp?.message,
                            )}
                            errorMessage={errors?.fourthTestTimestamp?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DatePickerControllerInput
                            control={control}
                            name="fifthTestTimestamp"
                            label={t('common:Fifth testing date')}
                            id="fifthTestTimestamp-date-input"
                            error={Boolean(errors?.fifthTestTimestamp?.message)}
                            errorMessage={errors?.fifthTestTimestamp?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DatePickerControllerInput
                            control={control}
                            name="exclusionStartDate"
                            label={t('common:Exclude start date')}
                            id="exclusionStartDate-date-input"
                            error={Boolean(errors?.exclusionStartDate?.message)}
                            errorMessage={errors?.exclusionStartDate?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <DatePickerControllerInput
                            control={control}
                            name="exclusionEndDate"
                            label={t('common:Exclude end date')}
                            id="exclusionEndDate-date-input"
                            error={Boolean(errors?.exclusionEndDate?.message)}
                            errorMessage={errors?.exclusionEndDate?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <Typography variant="h6">
                            {t('common:Quantities')}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <NumberControllerInput
                            control={control}
                            name="numberOfSamples"
                            numberMustBeGreaterThanZeroValidation
                            label={t('common:Number of test participants')}
                            id="number-of-test-classes-input"
                            error={Boolean(errors?.numberOfSamples?.message)}
                            errorMessage={errors?.numberOfSamples?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid item>
                          <NumberControllerInput
                            control={control}
                            name="numberOfPools"
                            label={t('common:Number of pools')}
                            id="number-of-pools-input"
                            error={Boolean(errors?.numberOfPools?.message)}
                            errorMessage={errors?.numberOfPools?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid
                          item
                          className={`${
                            Boolean(watchOrganizationTypeId !== 82002) &&
                            'display-none'
                          }`}>
                          <NumberControllerInput
                            control={control}
                            name="studentsCount"
                            label={t('common:Students count')}
                            id="students-count-input"
                            error={Boolean(errors?.studentsCount?.message)}
                            errorMessage={errors?.studentsCount?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                        <Grid
                          item
                          className={`${
                            Boolean(watchOrganizationTypeId !== 82002) &&
                            'display-none'
                          }`}>
                          <NumberControllerInput
                            control={control}
                            name="employeesCount"
                            label={t('common:Employees count')}
                            id="employees-count-input"
                            error={Boolean(errors?.employeesCount?.message)}
                            errorMessage={errors?.employeesCount?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>

                        <Grid item>
                          <Typography variant="h6">
                            {t('common:Reporting details')}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <TextControllerInput
                            control={control}
                            name="reportingContact"
                            label={t('common:Name')}
                            id="reporting-contact-input"
                            error={Boolean(errors?.reportingContact?.message)}
                            errorMessage={errors?.reportingContact?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>

                        <Grid item>
                          <TextControllerInput
                            control={control}
                            name="reportingEmail"
                            label={t('common:Email')}
                            id="reporting-email-input"
                            error={Boolean(errors?.reportingEmail?.message)}
                            errorMessage={errors?.reportingEmail?.message}
                            disabled={isUpdating || isReadOnly}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                      <Grid
                        container
                        direction="row"
                        spacing={2}
                        style={{
                          height: '100%',
                          flexDirection: 'column',
                          flexWrap: 'nowrap',
                        }}>
                        <Grid item xs={12} style={{ flexBasis: 'auto' }}>
                          <Typography variant="h6">
                            {t('common:Notes')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <div
                            id="notes-form-portal"
                            className="fullHeight"
                            ref={notesPortalRef}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item>
                <Card>
                  {contactsFieldArray.fields.length !== 0 ? (
                    contactsFieldArray.fields.map((item, index) => {
                      let contactsErrors:
                        | DeepMap<ContactPersonType, FieldError>
                        | undefined;
                      if (errors?.contacts && errors?.contacts[index]) {
                        contactsErrors = errors?.contacts[index];
                      }

                      return (
                        <Grid key={item.id} container spacing={2}>
                          <Grid item xs={12}>
                            <Grid container justify="space-between">
                              <Grid item>
                                <Typography variant="h6">
                                  {`${t('common:Additional contact person')} ${
                                    index >= 1 ? index + 1 : ''
                                  }`}
                                </Typography>
                              </Grid>
                              {index <= 0 && !isReadOnly && (
                                <Grid item>
                                  <Button
                                    color="secondary"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={() => {
                                      addNewContactPersonFieldArray();
                                    }}>
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
                                {!isReadOnly && (
                                  <Button
                                    color="primary"
                                    startIcon={<DeleteOutlineIcon />}
                                    onClick={() =>
                                      contactsFieldArray.remove(index)
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
                                  defaultValue={item.id}
                                  name={`contacts[${index}].id`}
                                  label={t('common:id')}
                                  id={`contact-person-id-input-${item.id}`}
                                  hidden
                                  disabled={isUpdating || isReadOnly}
                                />
                                <TextControllerInput
                                  control={control}
                                  name={`contacts[${index}].name`}
                                  label={t('common:Name')}
                                  id={`contact-person-name-input-${item.id}`}
                                  defaultValue={item.name}
                                  fieldRequired
                                  error={Boolean(contactsErrors?.name?.message)}
                                  errorMessage={contactsErrors?.name?.message}
                                  disabled={isUpdating || isReadOnly}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextControllerInput
                                  control={control}
                                  name={`contacts[${index}].email`}
                                  label={t('common:Email')}
                                  id={`contact-person-email-input-${item.id}`}
                                  defaultValue={item.email}
                                  mustBeValidEmailValidation
                                  fieldRequired
                                  error={Boolean(
                                    contactsErrors?.email?.message,
                                  )}
                                  errorMessage={contactsErrors?.email?.message}
                                  disabled={isUpdating || isReadOnly}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextControllerInput
                                  control={control}
                                  name={`contacts[${index}].landLineNumber`}
                                  label={t('common:Land line number')}
                                  id={`contact-person-lang-phone-input-${item.id}`}
                                  maxNumberOfCharacter={20}
                                  fieldRequired
                                  defaultValue={item.landLineNumber}
                                  error={Boolean(
                                    contactsErrors?.landLineNumber?.message,
                                  )}
                                  errorMessage={
                                    contactsErrors?.landLineNumber?.message
                                  }
                                  disabled={isUpdating || isReadOnly}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextControllerInput
                                  control={control}
                                  name={`contacts[${index}].phoneNumber`}
                                  label={t('common:Phone')}
                                  id={`contact-person-phone-input-${item.id}`}
                                  defaultValue={item.phoneNumber}
                                  error={Boolean(
                                    contactsErrors?.phoneNumber?.message,
                                  )}
                                  errorMessage={
                                    contactsErrors?.phoneNumber?.message
                                  }
                                  disabled={isUpdating || isReadOnly}
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
                            {!isReadOnly && (
                              <Button
                                color="secondary"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={() => {
                                  addNewContactPersonFieldArray();
                                }}>
                                <Typography>
                                  {t('common:Add another contact')}
                                </Typography>
                              </Button>
                            )}
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
                </Card>
              </Grid>
            </Grid>
          </BasicFormWrapper>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="flex-end" spacing={2}>
            <Grid item>
              <Button
                onClick={onCancelEditProgramMemberForm}
                disabled={isReadOnly}>
                {t('common:Cancel')}
              </Button>
            </Grid>
            <Grid item>
              <ButtonWithLoadingAnimation
                variant="contained"
                color="primary"
                isLoading={isUpdating}
                onClick={() => {
                  setOnSaveRedirect(false);
                  handleSubmit(onSubmitForm)();
                }}
                text={t('common:Save changes')}
                disabled={isReadOnly}
              />
            </Grid>
            <Grid item>
              <ButtonWithLoadingAnimation
                variant="contained"
                color="primary"
                isLoading={isUpdating}
                onClick={() => {
                  setOnSaveRedirect(true);
                  handleSubmit(onSubmitForm)();
                }}
                text={t('common:Save changes and return')}
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Portal container={notesPortalRef.current}>
        <Notes
          organizationId={programMember?.id || ''}
          isExpanded={isNotesExpanded}
          setExpanded={setNotesExpanded}
          isReadOnly={isReadOnly}
        />
      </Portal>
    </>
  );
};

export default EditProgramMemberForm;
