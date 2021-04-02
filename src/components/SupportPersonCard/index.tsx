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

// Material UI
import { Grid, Typography } from '@material-ui/core';

// Material Icons
import { EmailOutlined as EmailOutlinedIcon } from '@material-ui/icons';

// Custom components
import Card from 'components/Card';
import IconWithText from 'components/IconWithText';
import CircularLoading from 'components/loaders/CircularLoading';

// Actions
import { getSupportPerson } from 'redux/globalState/supportPerson/supportPersonSlice';

// Utils
import { RootState } from 'redux/combineReducers';

// Images
import defaultAvatar from 'assets/defaultProfile.svg';

interface ISupportPersonCardProps {
  organizationType?: number | '';
}

import styles from './SupportPersonCard.module.scss';

const SupportPersonCard: React.FC<ISupportPersonCardProps> = (
  props: ISupportPersonCardProps,
) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { organizationType } = props;

  const supportPersonData = useSelector(
    (state: RootState) => state.supportPerson.supportPerson,
  );

  const supportPersonStatus = useSelector(
    (state: RootState) => state.supportPerson.supportPersonStatus,
  );

  useEffect(() => {
    if (organizationType) {
      dispatch(
        getSupportPerson({
          organizationTypeId: organizationType,
        }),
      );
    }
  }, []);

  return (
    <Card>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">
            {t('common:Your support person')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center">
            <Grid item>
              <div className={styles.person}>
                <img
                  src={defaultAvatar}
                  alt={supportPersonData.name || 'support-person'}
                />
              </div>
            </Grid>
            <Grid item>
              <Typography className="bold">
                {supportPersonStatus.requesting ? (
                  <CircularLoading size={18} />
                ) : (
                  supportPersonData.name
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className="fullWidth">
          <IconWithText
            icon={<EmailOutlinedIcon fontSize="small" />}
            text={process.env.REACT_APP_DEFAULT_SUPPORT_PERSON_EMAIL || ''}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default SupportPersonCard;
