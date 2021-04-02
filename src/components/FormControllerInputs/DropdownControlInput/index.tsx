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
import { Controller } from 'react-hook-form';

// Custom components
import CustomSelect from 'components/CustomSelect';

// Types
import { IFormInputProps } from 'components/FormControllerInputs/types';

// Form validation
import { fieldRequired as formFieldRequired } from 'formValidation';

interface IDropdownControllerInputProps extends IFormInputProps {
  labelId: string;
  menuItems: React.ReactNode[];
  showLoadingEndAdornment?: boolean;
}

const DropdownControllerInput: React.FC<IDropdownControllerInputProps> = (
  props: IDropdownControllerInputProps,
) => {
  const {
    control,
    name,
    label,
    labelId,
    id,
    hidden,
    fieldRequired,
    error,
    errorMessage,
    disabled,
    menuItems,
    showLoadingEndAdornment,
  } = props;
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: {
          fieldRequired: (value): string | undefined => {
            if (fieldRequired) {
              const message = formFieldRequired(value);
              if (message) {
                return t(`formValidation:${message}`);
              }
            }
            return undefined;
          },
        },
      }}
      render={({ ref, ...rest }) => {
        return (
          <CustomSelect
            fullWidth
            className={`${hidden && 'display-none'}`}
            variant="outlined"
            inputLabelClassName="bg-color-white"
            error={error}
            labelId={labelId}
            label={label || ''}
            selectId={id}
            disabled={disabled}
            showLoadingAdornment={showLoadingEndAdornment}
            menuItems={menuItems}
            helperText={errorMessage}
            {...rest}
            inputRef={ref}
          />
          // TODO remove this after testing it.
          // <FormControl
          //   fullWidth
          //   variant="outlined"
          //   error={error}
          //   className={`${hidden && 'display-none'}`}>
          //   <InputLabel
          //     id={labelId}
          //     variant="outlined"
          //     className="bg-color-white">
          //     {label}
          //   </InputLabel>
          //   <Select
          //     {...rest}
          //     inputRef={ref}
          //     labelId={labelId}
          //     id={id}
          //     disabled={disabled || showLoadingEndAdornment}
          //     endAdornment={
          //       <>
          //         {showLoadingEndAdornment ? (
          //           <InputAdornment position="end" className="mr-6">
          //             <CircularProgress size={20} />
          //           </InputAdornment>
          //         ) : null}
          //       </>
          //     }>
          //     {menuItems}
          //   </Select>
          //   <FormHelperText>{errorMessage}</FormHelperText>
          // </FormControl>
        );
      }}
    />
  );
};

export default DropdownControllerInput;
