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

// Material UI
import { Typography, Grid } from '@material-ui/core';

// Material Icons
import { SvgIconComponent } from '@material-ui/icons';

// Utils
import separateNumberWithCommas from 'utils/separateNumberWithCommas';

type IconNumberTextPropsType = {
  icon: SvgIconComponent;
  number: number;
  text: string;
  textColor?: 'initial' | 'red';
  flexEnd?: boolean;
};

import styles from './IconNumberText.module.scss';

const IconNumberText: React.FC<IconNumberTextPropsType> = (
  props: IconNumberTextPropsType,
) => {
  const { icon, number, text, textColor = 'initial', flexEnd } = props;
  const Icon = icon;

  return (
    <Grid
      container
      direction="column"
      justify={flexEnd ? 'flex-end' : 'flex-start'}>
      <Grid item>
        <Grid container spacing={2}>
          <Grid item>
            <Icon className={styles.icon} />
          </Grid>
          <Grid item>
            <div
              className={`${styles.number} ${
                textColor === 'red' ? styles['red-color'] : ''
              }`}>
              {separateNumberWithCommas(number)}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">{text}</Typography>
      </Grid>
    </Grid>
  );
};

export default IconNumberText;
