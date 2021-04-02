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
    return 'Field is required!';
  }
  if (
    !value.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    )
  ) {
    return 'Enter a valid email!';
  }
  return undefined;
};

export const numberMustNotBeNegative = (value: number): string | undefined => {
  if (value === undefined && value === null) {
    return 'Field is required!';
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
    return 'Field is required!';
  }
  if (value <= 0) {
    return 'Value must be greater than 0!';
  }
  return undefined;
};

export const numberMustBePositive = (value: number): string | undefined => {
  if (value === undefined && value === null) {
    return 'Field is required!';
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
      message: 'Max number of characters allowed is',
      value: numberOfChars,
    };
  }
  return undefined;
};

export const atLeastOneItemInMultiSelect = (value: []): string | undefined => {
  if (value === undefined && value === null) {
    return 'Field is required!';
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
