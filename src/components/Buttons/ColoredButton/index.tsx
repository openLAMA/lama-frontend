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
import { Button, ButtonProps, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    backgroundColor: 'var(--backgroundColor)',
    borderColor: 'var(--backgroundColor)',
    '&:hover': {
      backgroundColor: 'var(--hoverBackgroundColor)',
    },

    color: 'var(--textColor)',
  },
});

interface IColoredButtonProps extends ButtonProps {
  className?: string;
  textColor?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  text: string;
}

const ColoredButton: React.FC<IColoredButtonProps> = (
  props: IColoredButtonProps,
) => {
  const classes = useStyles();

  const {
    className,
    textColor = '#fff',
    backgroundColor = '#EE2629',
    hoverBackgroundColor = '#A61A1C',
    text,
    ...rest
  } = props;

  const colorStyles = {
    '--textColor': textColor,
    '--backgroundColor': backgroundColor,
    '--hoverBackgroundColor': hoverBackgroundColor,
  } as React.CSSProperties;

  return (
    <Button
      className={`${className} ${classes.root}`}
      style={colorStyles}
      {...rest}>
      {text}
    </Button>
  );
};

export default ColoredButton;
