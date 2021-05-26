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
import { Paper } from '@material-ui/core';

interface ICardProps {
  children: React.ReactNode;
  noPadding?: boolean;
  smallPadding?: boolean;
  largePadding?: boolean;
  maxHeight?: boolean;
  maxWidth?: number | string;
  style?: React.CSSProperties;
  className?: string;
  minHeight?: string;
}

import styles from './Card.module.scss';

const Card: React.FC<ICardProps> = (props: ICardProps) => {
  const {
    children,
    noPadding,
    smallPadding,
    largePadding,
    maxHeight,
    maxWidth,
    style,
    className,
    minHeight,
  } = props;

  let padding = styles['card-padding'];
  if (noPadding) {
    padding = '';
  }
  if (smallPadding) {
    padding = styles['card-padding-small'];
  }
  if (largePadding) {
    padding = styles['card-padding-large'];
  }

  return (
    <Paper
      elevation={3}
      className={`${padding}
    ${maxHeight && 'fullHeight'}
    ${className}
    `}
      style={{
        ...style,
        maxWidth: maxWidth || 'initial',
        minHeight: minHeight || 'initial',
      }}>
      {children}
    </Paper>
  );
};

export default Card;
