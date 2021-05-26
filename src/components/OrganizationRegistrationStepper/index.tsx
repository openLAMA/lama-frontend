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

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

// Material UI
import { Grid, Stepper, Step, StepLabel } from '@material-ui/core';

// Custom components
import CircularLoading from 'components/loaders/CircularLoading';
import OrganizationRegistrationForm from 'components/pageSpecific/OrganizationRegistration/Forms/OrganizationRegistrationForm';
import OrganizationRegistrationSummary from 'components/pageSpecific/OrganizationRegistration/OrganizationRegistrationSummary';

// Actions
import { resetOrganizationData } from 'redux/organizationRegistration/organizationRegistrationSlice';
import { getCities } from 'redux/globalState/citiesData/citiesDataSlice';
import { getOrganizationTypes } from 'redux/globalState/organizationTypes/organizationTypesSlice';

// Utils
import { RootState } from 'redux/combineReducers';

// Routes
import { UnauthenticatedRoutes } from 'config/routes';

import styles from './OrganizationRegistrationStepper.module.scss';

const OrganizationRegistrationStepper: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const organizationName = useSelector(
    (state: RootState) => state.organizationRegistrationData.data.name,
  );

  const citiesStatus = useSelector(
    (state: RootState) => state.cities.citiesStatus,
  );
  const organizationTypesStatus = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypesStatus,
  );

  useLayoutEffect(() => {
    if (!citiesStatus.requesting && !citiesStatus.success) {
      dispatch(getCities());
    }
    if (
      !organizationTypesStatus.requesting &&
      !organizationTypesStatus.success
    ) {
      dispatch(getOrganizationTypes());
    }
  }, []);

  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [t('common:General information'), t('common:Summary')];

  const getStepsContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <OrganizationRegistrationForm
            onCancelRegistration={onCancelRegistration}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <OrganizationRegistrationSummary
            onHandleBack={handleBack}
            onCancelRegistration={onCancelRegistration}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onCancelRegistration = () => {
    dispatch(resetOrganizationData());
    history.push(UnauthenticatedRoutes.signUpRoute.route);
  };

  useEffect(() => {
    if (!organizationName) {
      history.push(UnauthenticatedRoutes.signUpRoute.route);
    }
  }, [organizationName]);

  const isLoading =
    citiesStatus.requesting || organizationTypesStatus.requesting;

  let text = '';
  if (citiesStatus.requesting) {
    text = t('progressMessages:Fetching cities');
  }

  if (organizationTypesStatus.requesting) {
    text = t('progressMessages:Fetching organization types');
  }

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={6}>
      {!isLoading && citiesStatus.success && organizationTypesStatus.success ? (
        <Grid item xs={12} className="fullWidth">
          <Stepper
            activeStep={activeStep}
            className="pl-0 pt-0 pr-0 pb-0 bg-color-transparent">
            {steps.map((label) => {
              return (
                <Step key={label}>
                  <StepLabel className={styles['step-label']}>
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Grid>
      ) : (
        <CircularLoading center text={text} />
      )}

      {citiesStatus.success && organizationTypesStatus.success && (
        <Grid item xs={12}>
          {getStepsContent(activeStep)}
        </Grid>
      )}
    </Grid>
  );
};

export default OrganizationRegistrationStepper;
