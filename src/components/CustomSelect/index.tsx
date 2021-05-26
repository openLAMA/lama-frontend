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
import {
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  CircularProgress,
  FormHelperText,
} from '@material-ui/core';

interface ICustomSelectProps {
  fullWidth?: boolean;
  variant?: 'standard' | 'outlined' | 'filled';
  className?: string;
  inputLabelClassName?: string;
  error?: boolean;
  helperText?: string;
  labelId: string;
  selectId: string;
  label: string;
  value: any;
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  menuItems: React.ReactNode[];
  disabled?: boolean;
  showLoadingAdornment?: boolean;
  inputRef?: React.Ref<any>;
  minWidth?: string;
}

const CustomSelect: React.FC<ICustomSelectProps> = (
  props: ICustomSelectProps,
) => {
  const {
    fullWidth,
    variant,
    className,
    inputLabelClassName,
    error,
    helperText,
    selectId,
    labelId,
    label,
    value,
    onChange,
    menuItems,
    disabled,
    showLoadingAdornment,
    inputRef,
    minWidth,
  } = props;

  return (
    <FormControl
      fullWidth={fullWidth}
      variant={variant}
      className={className}
      error={error}
      style={{ minWidth }}>
      <InputLabel
        id={labelId}
        className={inputLabelClassName}
        variant={variant}>
        {label}
      </InputLabel>
      <Select
        inputRef={inputRef}
        labelId={labelId}
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled || showLoadingAdornment}
        endAdornment={
          <>
            {showLoadingAdornment ? (
              <InputAdornment position="end" className="mr-6">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null}
          </>
        }>
        {menuItems}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
