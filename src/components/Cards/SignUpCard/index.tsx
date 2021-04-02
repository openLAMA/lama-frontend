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
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

// Material UI
import { Grid, Button } from '@material-ui/core';

// Custom components
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import TextControllerInput from 'components/FormControllerInputs/TextControllerInput';
import AuthenticationCard from 'components/AuthenticationCard';

// Actions
import { setOrganizationName } from 'redux/organizationRegistration/organizationRegistrationSlice';

// Routes
import { UnauthenticatedRoutes } from 'config/routes';

type SignUpCardType = {
  organizationName: string;
};

const SignUpCard: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { control, handleSubmit, errors } = useForm<SignUpCardType>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      organizationName: '',
    },
  });

  const onStart: SubmitHandler<SignUpCardType> = async (values) => {
    const { organizationName } = values;
    dispatch(setOrganizationName(organizationName));
    history.push(UnauthenticatedRoutes.organizationRegistrationRoute.route);
  };

  return (
    <AuthenticationCard
      title={t('common:Register')}
      subtitle={t('common:Please provide your organization name')}>
      <Grid item className="fullWidth">
        <BasicFormWrapper>
          <TextControllerInput
            control={control}
            name="organizationName"
            label={t('common:Organization name')}
            id="organization-name-input"
            fieldRequired
            maxNumberOfCharacter={100}
            error={Boolean(errors.organizationName?.message)}
            errorMessage={errors.organizationName?.message}
          />
        </BasicFormWrapper>
      </Grid>
      <Grid item className="fullWidth">
        <Button
          className="fullWidth"
          color="primary"
          variant="contained"
          onClick={() => handleSubmit(onStart)()}>
          {t('common:Start')}
        </Button>
      </Grid>
      <Grid item>
        <Grid
          className="pb-4 pt-4"
          container
          direction="column"
          alignItems="flex-end">
          <Grid item>
            <Link to={UnauthenticatedRoutes.loginRoute.route}>
              {t('common:Already registered ?')}
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </AuthenticationCard>
  );
};

export default SignUpCard;
