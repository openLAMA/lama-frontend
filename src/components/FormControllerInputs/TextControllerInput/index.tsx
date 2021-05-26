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
  maxNumberOfCharacters as formMaxNumberOfCharacter,
  mustBeValidEmail as formMustBeValidEmail,
} from 'formValidation';

interface ITextControllerInputProps extends IFormInputProps {
  maxNumberOfCharacter?: number;
  mustBeValidEmailValidation?: boolean;
  multiline?: boolean;
  rows?: number;
}

const TextControllerInput: React.FC<ITextControllerInputProps> = (
  props: ITextControllerInputProps,
) => {
  const {
    control,
    name,
    label,
    id,
    multiline,
    fieldRequired,
    maxNumberOfCharacter,
    mustBeValidEmailValidation,
    disabled,
    defaultValue,
    error,
    errorMessage,
    hidden,
    rows,
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
          maxNumberOfCharacters: (value): string | undefined => {
            if (maxNumberOfCharacter) {
              const messageObject = formMaxNumberOfCharacter(
                maxNumberOfCharacter,
                value,
              );
              if (messageObject?.message) {
                return t(`formValidation:${messageObject?.message}`, {
                  numberOfChars: messageObject.value,
                });
              }
            }
            return undefined;
          },
          mustBeValidEmail: (value): string | undefined => {
            if (mustBeValidEmailValidation) {
              const message = formMustBeValidEmail(value);
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
            multiline={multiline}
            variant="outlined"
            error={error}
            helperText={errorMessage}
            disabled={disabled}
            className={`${hidden && 'display-none'}`}
            rows={rows}
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

export default TextControllerInput;
