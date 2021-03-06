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

export const fieldRequired = (value: string | number): string | undefined => {
  if (value !== undefined && value !== null && value !== '') {
    return undefined;
  }
  return 'Field is required!';
};

export const mustBeValidEmail = (value: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (
    !value.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    )
    // Regex check copied from Fluent .NET.
    // !value.match(
    //   /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-||_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+([a-z]+|\d|-|\.{0,1}|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])?([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/,
    // )
  ) {
    return 'Enter a valid email!';
  }
  return undefined;
};

export const numberMustNotBeNegative = (value: number): string | undefined => {
  if (value === undefined && value === null) {
    return undefined;
  }
  if (value <= 0) {
    return 'Value must be greater than 0!';
  }
  return undefined;
};

export const numberMustBeGreaterThanZero = (
  value: number,
): string | undefined => {
  if (value === undefined && value === null) {
    return undefined;
  }
  if (value <= 0) {
    return 'Value must be greater than 0!';
  }
  return undefined;
};

export const numberMustBePositive = (value: number): string | undefined => {
  if (value === undefined && value === null) {
    return undefined;
  }
  if (value < 0) {
    return 'Value must be positive!';
  }
  return undefined;
};

export const maxNumberOfCharacters = (
  numberOfChars: number,
  value: string,
):
  | {
      message: string;
      value: string | number;
    }
  | undefined => {
  if (value.length > numberOfChars) {
    return {
      message: 'Max number of characters allowed is {x}!',
      value: numberOfChars,
    };
  }
  return undefined;
};

export const atLeastOneItemInMultiSelect = (value: []): string | undefined => {
  if (value === undefined && value === null) {
    return undefined;
  }
  if (value.length <= 0) {
    return 'At least one item must be selected!';
  }
  return undefined;
};

export const checkForDuplicates = (
  value: string,
  arr: Record<string, unknown>[],
  key: string,
  skipIndex: number,
): string | undefined => {
  if (
    value !== undefined &&
    value !== null &&
    value !== '' &&
    arr.length !== 0 &&
    key !== undefined &&
    key !== null &&
    key !== ''
  ) {
    const findIndex = arr.findIndex((item, index) => {
      if (index === skipIndex) return false;
      return item[key] === value;
    });
    if (findIndex === -1) {
      return undefined;
    }
    return 'formValidation:This email address is already being used!';
  }
  return undefined;
};
