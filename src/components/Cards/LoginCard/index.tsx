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
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

// Material UI
import { Grid } from '@material-ui/core';

// Custom components
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';
import TextControllerInput from 'components/FormControllerInputs/TextControllerInput';
import AuthenticationCard from 'components/AuthenticationCard';

// Actions
import { clearLoginFlags, login } from 'redux/auth/authSlice';

// Routes
import { UnauthenticatedRoutes } from 'config/routes';

// Utils
import { RootState } from 'redux/combineReducers';

type LoginCardType = {
  email: string;
};

const LoginCard: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const loginRequestStatus = useSelector(
    (state: RootState) => state.auth.loginRequestStatus,
  );

  const { control, handleSubmit, errors } = useForm<LoginCardType>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (loginRequestStatus.success) {
      history.push(UnauthenticatedRoutes.loginEmailSentRoute.route);
      dispatch(clearLoginFlags());
    }
  }, [loginRequestStatus]);

  const onLogin: SubmitHandler<LoginCardType> = async (values) => {
    const { email } = values;
    dispatch(login({ email }));
  };

  return (
    <AuthenticationCard
      title={t('common:Log in')}
      subtitle={t(
        'common:You will receive an email with the access link to the LAMA Portal',
      )}>
      <Grid item className="fullWidth">
        <BasicFormWrapper>
          <TextControllerInput
            control={control}
            name="email"
            label={t('common:Email')}
            id="email-input"
            fieldRequired
            maxNumberOfCharacter={50}
            mustBeValidEmailValidation
            error={Boolean(errors.email?.message)}
            errorMessage={errors.email?.message}
          />
        </BasicFormWrapper>
      </Grid>
      <Grid item className="fullWidth">
        <ButtonWithLoadingAnimation
          fullWidth
          color="primary"
          variant="contained"
          isLoading={loginRequestStatus.requesting}
          text={t('common:Login')}
          onClick={() => handleSubmit(onLogin)()}
        />
      </Grid>
      <Grid item>
        <Grid
          className="pb-4 pt-4"
          container
          direction="column"
          alignItems="flex-end">
          <Grid item>
            <Link to={UnauthenticatedRoutes.signUpRoute.route}>
              {t('common:Not registered yet ?')}
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </AuthenticationCard>
  );
};

export default LoginCard;
