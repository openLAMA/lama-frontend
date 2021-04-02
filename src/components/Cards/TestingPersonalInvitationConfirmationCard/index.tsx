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
import Card from 'components/Card';
import CircularLoading from 'components/loaders/CircularLoading';

// Actions
import { checkTestingPersonalInvitationConfirmation } from 'redux/testingPersonalInvitationConfirmation/testingPersonalInvitationConfirmationSlice';

// Utils
import { RootState } from 'redux/combineReducers';

const TestingPersonalInvitationConfirmationCard: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const shifts = queryParams.get('shifts')?.split(',') || [];

  const { t } = useTranslation();

  const testingPersonalInvitationConfirmationStatus = useSelector(
    (state: RootState) =>
      state.testingPersonalInvitationConfirmation
        .testingPersonalInvitationConfirmationStatus,
  );

  const shiftsBooked = useSelector(
    (state: RootState) =>
      state.testingPersonalInvitationConfirmation.shiftsBooked,
  );

  useLayoutEffect(() => {
    if (token) {
      dispatch(
        checkTestingPersonalInvitationConfirmation({
          token: token,
          shifts: shifts,
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

  let tokenExpired;
  const isTokenExpired = testingPersonalInvitationConfirmationStatus.failure;
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
                {t('common:Sorry, the token is no longer valid')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

  let successDataButFull;
  if (
    testingPersonalInvitationConfirmationStatus.success &&
    shiftsBooked.length === 0
  ) {
    successDataButFull = (
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
                {t('common:Thank you for your request!')}
              </Typography>
            </Grid>
            <Grid item>
              <Card largePadding maxWidth="448px">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      {t(
                        'common:The subscription process is based on the first come first serve principle',
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom className="bold">
                      {t(
                        'common:Unfortunately the day is already fully subscribed',
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom className="bold">
                      {t(
                        'common:We will consider you for all future invitations',
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

  let successData;
  if (
    testingPersonalInvitationConfirmationStatus.success &&
    shiftsBooked.length !== 0
  ) {
    successData = (
      <>
        <Grid item>
          <CheckCircleOutlineIcon className="color-success font-size-13" />
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
                {t('common:Thank you for your request!')}
              </Typography>
            </Grid>
            <Grid item>
              <Card largePadding maxWidth="448px">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      {t(
                        'common:The subscription process is based on the first come first serve principle',
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      {t(
                        'common:You successfully accepted the upcoming assignment',
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      {t('common:Shift')}:
                      {shiftsBooked.map((shift) => {
                        if (shift === 1) {
                          return (
                            <Typography key={shift} className="pr-2 pl-2">
                              {t('common:Morning')}
                            </Typography>
                          );
                        }
                        if (shift === 2) {
                          return (
                            <Typography key={shift} className="pr-2 pl-2">
                              {t('common:Afternoon')}
                            </Typography>
                          );
                        }
                        return '';
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

  const data = noTokenFound ||
    tokenExpired ||
    successDataButFull ||
    successData || <div>{t('common:Error')}</div>;

  return (
    <>
      {testingPersonalInvitationConfirmationStatus.requesting ? (
        <CircularLoading
          withGrid
          size={80}
          text={t('common:Checking availability!')}
        />
      ) : (
        data
      )}
    </>
  );
};

export default TestingPersonalInvitationConfirmationCard;
