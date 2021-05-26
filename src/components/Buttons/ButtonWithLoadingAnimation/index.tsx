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
import { ButtonProps, CircularProgress } from '@material-ui/core';

// Custom components
import ColoredButton from 'components/Buttons/ColoredButton';

interface IButtonWithLoadingAnimationProps extends ButtonProps {
  text: string;
  isLoading?: boolean;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onMouseLeave?: () => void;
  onMouseOver?: () => void;
  onTouchEnd?: () => void;
  onTouchStart?: () => void;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  textColor?: string;
}

import styles from './ButtonWithLoadingAnimation.module.scss';

const ButtonWithLoadingAnimation: React.FC<IButtonWithLoadingAnimationProps> = React.forwardRef<
  any,
  IButtonWithLoadingAnimationProps
>((props: IButtonWithLoadingAnimationProps, ref) => {
  const {
    text,
    isLoading,
    className,
    fullWidth,
    disabled,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseOver,
    onTouchEnd,
    onTouchStart,
    ...rest
  } = props;

  return (
    <div
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      ref={ref}
      className={`${styles.wrapper} ${fullWidth && 'fullWidth'} ${className}`}>
      <ColoredButton
        {...rest}
        disabled={isLoading || disabled}
        className={`${fullWidth && 'fullWidth'} `}
        text={text}
      />

      {isLoading && (
        <CircularProgress size={24} className={styles['button-progress']} />
      )}
    </div>
  );
});

ButtonWithLoadingAnimation.displayName = 'ButtonWithLoadingAnimation';

export default ButtonWithLoadingAnimation;
