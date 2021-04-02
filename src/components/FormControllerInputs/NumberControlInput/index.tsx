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

// Material UI
import { TextField } from '@material-ui/core';

// Types
import { IFormInputProps } from 'components/FormControllerInputs/types';

// Form validation
import {
  fieldRequired as formFieldRequired,
  numberMustBeGreaterThanZero as formNumberMustBeGreaterThanZero,
  numberMustBePositive as formNumberMustBePositive,
} from 'formValidation';

interface INumberControllerInputProps extends IFormInputProps {
  numberMustBeGreaterThanZeroValidation?: boolean;
  numberMustBePositive?: boolean;
}

const NumberControllerInput: React.FC<INumberControllerInputProps> = (
  props: INumberControllerInputProps,
) => {
  const {
    control,
    name,
    label,
    id,
    hidden,
    fieldRequired,
    numberMustBeGreaterThanZeroValidation,
    numberMustBePositive,
    disabled,
    error,
    errorMessage,
    defaultValue,
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
          numberMustBeGreaterThanZero: (value): string | undefined => {
            if (numberMustBeGreaterThanZeroValidation) {
              const message = formNumberMustBeGreaterThanZero(value);
              if (message) {
                return t(`formValidation:${message}`);
              }
            }
            return undefined;
          },
          numberMustBePositive: (value): string | undefined => {
            if (numberMustBePositive) {
              const message = formNumberMustBePositive(value);
              if (message) {
                return t(`formValidation:${message}`);
              }
            }
            return undefined;
          },
        },
      }}
      defaultValue={defaultValue}
      render={({ ref, ...rest }) => {
        return (
          <TextField
            {...rest}
            label={label}
            id={id}
            inputRef={ref}
            fullWidth
            variant="outlined"
            error={error}
            helperText={errorMessage}
            type="number"
            disabled={disabled}
            className={`${hidden && 'display-none'}`}
            InputLabelProps={{
              classes: {
                root: 'custom-label-text-overflow',
                shrink: 'custom-label-text-shrinked',
              },
            }}
          />
        );
      }}
    />
  );
};

export default NumberControllerInput;
