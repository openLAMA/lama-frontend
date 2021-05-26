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

import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// Material UI
import { Grid, Typography } from '@material-ui/core';

// Material Icons
import {
  CloseOutlined as CloseOutlinedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@material-ui/icons';

// Custom components
import CircularLoading from 'components/loaders/CircularLoading';

// Actions
import { checkFollowUpEmailConfirmation } from 'redux/followUpEmailConfirmation/followUpEmailConfirmationSlice';

// Utils
import { RootState } from 'redux/combineReducers';

const FollowUpEmailConfirmationCard: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const accepted = queryParams.get('accepted');

  let isAccepted: boolean | undefined = undefined;
  if (accepted === 'true') {
    isAccepted = true;
  }
  if (accepted === 'false') {
    isAccepted = false;
  }

  const { t } = useTranslation();

  const followUpEmailConfirmationStatus = useSelector(
    (state: RootState) =>
      state.followUpEmailConfirmation.followUpEmailConfirmationStatus,
  );

  useLayoutEffect(() => {
    if (token && isAccepted !== undefined) {
      dispatch(
        checkFollowUpEmailConfirmation({
          token: token || '',
          isAccepted,
        }),
      );
    }
  }, []);

  let noTokenFound;
  if (!token) {
    noTokenFound = (
      <>
        <Grid item>
          <CloseOutlinedIcon className="color-error font-size-13" />
        </Grid>
        <Grid item>
          <Typography variant="h4">{t('common:No token found!')}</Typography>
        </Grid>
      </>
    );
  }

  let noAcceptanceValueFound;
  if (isAccepted === undefined) {
    noAcceptanceValueFound = (
      <>
        <Grid item>
          <CloseOutlinedIcon className="color-error font-size-13" />
        </Grid>
        <Grid item>
          <Typography variant="h4">
            {t('common:Missing acceptance value!')}
          </Typography>
        </Grid>
      </>
    );
  }

  let tokenExpired;
  const isTokenExpired = followUpEmailConfirmationStatus.failure;
  if (isTokenExpired) {
    tokenExpired = (
      <>
        <Grid item>
          <CloseOutlinedIcon className="color-error font-size-13" />
        </Grid>
        <Grid item>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}>
            <Grid item>
              <Typography variant="h4">
                {t('common:We have already received your feedback')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

  let successData;
  if (followUpEmailConfirmationStatus.success) {
    successData = (
      <>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={4}>
          <Grid item>
            <CheckCircleOutlineIcon className="color-success font-size-13" />
          </Grid>
          <Grid item>
            <Typography variant="h4" align="center">
              {t('common:Thank you for your response')}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  }

  const data = noTokenFound ||
    noAcceptanceValueFound ||
    tokenExpired ||
    successData || <div>{t('common:Error')}</div>;

  return (
    <>
      {followUpEmailConfirmationStatus.requesting ? (
        <CircularLoading
          center
          size={80}
          text={t('common:Working on the request')}
        />
      ) : (
        data
      )}
    </>
  );
};

export default FollowUpEmailConfirmationCard;
