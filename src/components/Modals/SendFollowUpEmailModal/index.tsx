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
import { Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

// Custom components
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import ModalWrapper from 'components/Wrappers/ModalWrapper';
import TextControllerInput from 'components/FormControllerInputs/TextControllerInput';
import FollowUpSMESummaryCard from 'components/pageSpecific/OnboardingAndTrainingAdministration/FollowUpModal/FollowUpSMESummaryCard';
import FollowUpCompanySummaryCard from 'components/pageSpecific/OnboardingAndTrainingAdministration/FollowUpModal/FollowUpCompanySummaryCard';
import FollowUpCampSummaryCard from 'components/pageSpecific/OnboardingAndTrainingAdministration/FollowUpModal/FollowUpCampSummaryCard';

// Actions
import {
  postFollowUpEmail,
  resetFollowUpEmail,
} from 'redux/followUpEmail/followUpEmailSlice';

// Types
import { ContactPersonType } from 'redux/globalTypes';
import { PostFollowUpEmailRequestType } from 'redux/followUpEmail/types';
import { ProgramMemberType } from 'redux/globalState/programMembers/types';

// Utils
import { RootState } from 'redux/combineReducers';
import organizationTypesEnum from 'utils/organizationTypesEnum';
import programMemberStatusEnum from 'utils/programMemberStatusEnum';

// Form validation
import { fieldRequired as formFieldRequired } from 'formValidation';

interface ISendFollowUpEmailModalProps {
  programMember: ProgramMemberType;
  onClose: () => void;
  listOfContactPeople: ContactPersonType[] | [];
}

const SendFollowUpEmailModal: React.FC<ISendFollowUpEmailModalProps> = (
  props: ISendFollowUpEmailModalProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { programMember, onClose, listOfContactPeople } = props;

  const followUpEmailStatus = useSelector(
    (state: RootState) => state.followUpEmail.followUpEmailStatus,
  );

  const {
    control,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    watch,
  } = useForm<any>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      followUpMessage: '',
      additionalEmail: '',
      recipients: [],
      orgContact: null,
    },
  });

  const watchRecipients = watch('recipients', []);

  useEffect(() => {
    return () => {
      dispatch(resetFollowUpEmail());
    };
  }, []);

  useEffect(() => {
    if (watchRecipients.length !== 0) {
      clearErrors('additionalEmail');
    }
  }, [watchRecipients]);

  const onSubmitForm = (values: any) => {
    const defaultCCReceiver = process.env.REACT_APP_CC_RECEIVER || '';
    if (programMember.organizationTypeId === organizationTypesEnum.CAMP) {
      const ccReceivers = [defaultCCReceiver];
      const receivers = [values.orgContact.email];
      if (values.additionalEmail) {
        receivers.push(values.additionalEmail);
      }
      const data: PostFollowUpEmailRequestType = {
        organizationId: programMember.id,
        message: values.followUpMessage,
        receivers,
        ccReceivers,
        organizationContactPersonId: values.orgContact?.id,
      };
      dispatch(postFollowUpEmail(data));
    } else {
      const receivers = values.recipients.map((person: any) => person.email);

      if (receivers.length === 0 && !values.additionalEmail) {
        setError('additionalEmail', {
          type: 'manual',
          message: t('formValidation:Field is required!'),
          shouldFocus: true,
        });
        return null;
      }
      if (values.additionalEmail) {
        receivers.unshift(values.additionalEmail);
      }
      const ccReceivers = [defaultCCReceiver];
      if (programMember.organizationTypeId === organizationTypesEnum.Company) {
        if (programMember.supportPerson?.email) {
          ccReceivers.unshift(programMember.supportPerson.email);
        } else {
          return;
        }
      }
      const data: PostFollowUpEmailRequestType = {
        organizationId: programMember.id,
        message: values.followUpMessage,
        receivers,
        ccReceivers: [defaultCCReceiver],
        organizationContactPersonId: values?.orgContact?.id,
      };
      dispatch(postFollowUpEmail(data));
    }
  };

  let disabledSendButton = false;
  if (!programMember.id) {
    disabledSendButton = true;
  }

  if (
    programMember.organizationTypeId === organizationTypesEnum.Company ||
    programMember.organizationTypeId === organizationTypesEnum.SME
  ) {
    if (programMember.organizationTypeId === organizationTypesEnum.SME) {
      if (!programMember.firstTestTimestamp) {
        disabledSendButton = true;
      }

      if (!programMember.area) {
        disabledSendButton = true;
      }
    }
    if (programMember.organizationTypeId === organizationTypesEnum.Company) {
      if (!programMember.supportPersonId) {
        disabledSendButton = true;
      }
    }
    if (programMember.isOnboardingEmailSent) {
      disabledSendButton = true;
    }
    // if (!programMember.organizationShortcutName) {
    //   disabledSendButton = true;
    // }
    // if (!programMember.epaadId) {
    //   disabledSendButton = true;
    // }
    if (programMember.status === programMemberStatusEnum.NotActive) {
      disabledSendButton = true;
    }
  } else if (programMember.organizationTypeId === organizationTypesEnum.CAMP) {
    // Do nothing
  } else {
    disabledSendButton = true;
  }

  const renderForType = () => {
    if (programMember.organizationTypeId === organizationTypesEnum.SME) {
      return (
        <>
          <Grid item xs={12}>
            <FollowUpSMESummaryCard />
          </Grid>
        </>
      );
    } else if (
      programMember.organizationTypeId === organizationTypesEnum.Company
    ) {
      return (
        <>
          <Grid item xs={12}>
            <FollowUpCompanySummaryCard />
          </Grid>
        </>
      );
    } else if (
      programMember.organizationTypeId === organizationTypesEnum.CAMP
    ) {
      return (
        <>
          <Grid item xs={12}>
            <FollowUpCampSummaryCard />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item xs={12}>
          <TextControllerInput
            control={control}
            name="followUpMessage"
            label={t('common:Follow up message')}
            id="follow-up-message-input"
            fieldRequired
            maxNumberOfCharacter={500}
            multiline
            rows={20}
            error={Boolean(errors?.followUpMessage?.message)}
            errorMessage={errors?.followUpMessage?.message}
            disabled={followUpEmailStatus.requesting}
          />
        </Grid>
      );
    }
  };

  return (
    <>
      <ModalWrapper
        isOpen
        type="primary"
        title={t('modals:Follow up email')}
        dialogWidth="680px"
        loading={followUpEmailStatus.requesting}
        onCancel={(event: any) => {
          event.stopPropagation();
          onClose();
        }}
        onSend={(event: any) => {
          event.stopPropagation();
          handleSubmit(onSubmitForm)();
        }}
        disabledSendButton={disabledSendButton}>
        <BasicFormWrapper>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextControllerInput
                      control={control}
                      name="additionalEmail"
                      label={t('common:Additional email')}
                      id="additional-email-input"
                      mustBeValidEmailValidation
                      error={Boolean(errors?.additionalEmail?.message)}
                      errorMessage={errors?.additionalEmail?.message}
                      disabled={followUpEmailStatus.requesting}
                    />
                  </Grid>
                  {programMember.organizationTypeId !==
                    organizationTypesEnum.CAMP && (
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name="recipients"
                        render={({ ref, onChange, ...rest }) => {
                          return (
                            <Autocomplete
                              {...rest}
                              multiple
                              id="recipients"
                              options={listOfContactPeople}
                              getOptionLabel={(option: ContactPersonType) => {
                                return `${option.email} (${option.name})` || '';
                              }}
                              onChange={(event: any, newValue: any) => {
                                onChange(newValue);
                                return newValue;
                              }}
                              renderOption={(option: ContactPersonType) => {
                                return (
                                  <span>{`${option.email} (${option.name})`}</span>
                                );
                              }}
                              renderInput={(params) => {
                                return (
                                  <TextField
                                    {...params}
                                    label={t('common:Recipients')}
                                    variant="outlined"
                                    error={Boolean(errors.recipients?.message)}
                                    helperText={
                                      Boolean(errors.recipients?.message)
                                        ? t(
                                            `formValidation:${errors.recipients?.message}`,
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
                  {programMember.organizationTypeId ===
                    organizationTypesEnum.CAMP && (
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name="orgContact"
                        rules={{
                          validate: {
                            fieldRequired: (value): string | undefined => {
                              const message = formFieldRequired(value);
                              if (message) {
                                return t(`formValidation:${message}`);
                              }
                              return undefined;
                            },
                          },
                        }}
                        render={({ ref, onChange, ...rest }) => {
                          return (
                            <Autocomplete
                              {...rest}
                              id="orgContact"
                              options={listOfContactPeople}
                              getOptionLabel={(option: ContactPersonType) => {
                                return `${option.email} (${option.name})` || '';
                              }}
                              onChange={(event: any, newValue: any) => {
                                onChange(newValue);
                                return newValue;
                              }}
                              renderOption={(option: ContactPersonType) => {
                                return (
                                  <span>{`${option.email} (${option.name})`}</span>
                                );
                              }}
                              renderInput={(params) => {
                                return (
                                  <TextField
                                    {...params}
                                    label={t('common:Organization contact')}
                                    variant="outlined"
                                    error={Boolean(errors.orgContact?.message)}
                                    helperText={
                                      Boolean(errors.orgContact?.message)
                                        ? t(
                                            `formValidation:${errors.orgContact?.message}`,
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
                </Grid>
              </Grid>
              {renderForType()}
            </Grid>
          </Grid>
        </BasicFormWrapper>
      </ModalWrapper>
    </>
  );
};

export default SendFollowUpEmailModal;
