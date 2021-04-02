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

// Material Dates
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

// Types
import { IFormInputProps } from 'components/FormControllerInputs/types';

// Form validation
import { fieldRequired as formFieldRequired } from 'formValidation';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IDatePickerControllerInputProps extends IFormInputProps {}

const DatePickerControllerInput: React.FC<IDatePickerControllerInputProps> = (
  props: IDatePickerControllerInputProps,
) => {
  const {
    control,
    name,
    label,
    id,
    fieldRequired,
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
        },
      }}
      defaultValue={defaultValue || null}
      render={({ ref, ...rest }) => {
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              {...rest}
              label={label}
              id={id}
              autoOk
              inputRef={ref}
              fullWidth
              variant="inline"
              inputVariant="outlined"
              format="dd/MM/yyyy"
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              error={error}
              helperText={errorMessage}
              disabled={disabled}
              InputLabelProps={{
                classes: {
                  root: 'custom-label-text-overflow with-icon',
                  shrink: 'custom-label-text-shrinked',
                },
              }}
            />
          </MuiPickersUtilsProvider>
        );
      }}
    />
  );
};

export default DatePickerControllerInput;
