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

// Material UI
import { Grid, Typography, Paper, Divider } from '@material-ui/core';

// Material Icons
import {
  InfoOutlined as InfoOutlinedIcon,
  PhoneOutlined as PhoneOutlinedIcon,
} from '@material-ui/icons';

interface IAuthenticationCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

import styles from './AuthenticationCard.module.scss';

const AuthenticationCard: React.FC<IAuthenticationCardProps> = (
  props: IAuthenticationCardProps,
) => {
  const { title, subtitle, children } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Paper elevation={3}>
        <Grid
          className={styles['root-container']}
          container
          direction="column"
          alignItems="center"
          spacing={2}>
          <Grid item>
            <Typography className="pt-2 pb-3" variant="h4">
              {title}
            </Typography>
          </Grid>
          {subtitle && (
            <Grid item className="fullWidth">
              <Typography variant="body2">{subtitle}</Typography>
            </Grid>
          )}
          {children}
          <Grid item className="fullWidth">
            <Divider variant="fullWidth" />
          </Grid>
          <Grid item className="fullWidth">
            <Grid container alignItems="center" spacing={1}>
              <Grid item className="align-self-flex-end">
                <InfoOutlinedIcon />
              </Grid>
              <Grid item>
                <Typography variant="h6">{t('common:Support')}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography className="pb2 pt2" variant="body2">
              {`${t(
                'common:If you have any questions or issues with the log in process, feel free to contact us on',
              )}:`}
            </Typography>
          </Grid>
          <Grid item className="fullWidth">
            <Grid container spacing={1}>
              <Grid item className="align-self-flex-end">
                <PhoneOutlinedIcon fontSize="small" />
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  {process.env.REACT_APP_DEFAULT_SUPPORT_PERSON_EMAIL}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default AuthenticationCard;
