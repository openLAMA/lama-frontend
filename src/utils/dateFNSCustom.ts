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

import i18next from 'i18next';
import { enUS, de } from 'date-fns/locale';
import {
  parseISO,
  formatISO,
  format,
  add,
  sub,
  getYear,
  getMonth,
  getDate,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  isValid,
  getWeek,
  isPast,
  isToday,
} from 'date-fns';

const locales = [enUS, de];

/**
 *
 * @param {String} languageString - Used to get the locale object from date-fns.
 * if more languages needed to be supported, import from 'date-fns/locale' and add them to the array.
 * couldn't find a way to import all automatically. This way we will reduce bundle size too.
 * @returns {Object} date-fns/locale
 */
const getLocaleObject = (languageString?: string) => {
  if (!languageString) {
    return de;
  }

  const locale = locales.find((loc) => loc.code === languageString);
  if (!locale) {
    console.warn(`Couldn't find locale '${languageString}', default to en`);
    return enUS;
  }
  return locale;
};

/**
 * @param {String} date - Date as a string, example '2021-01-22T14:39:21.000Z'
 * @param {String} defaultLanguage - Current selected language for the project in order for the date-fns lib to translate it automatically.
 * @returns {String} formatted date or '-' if invalid date is passed
 */

export const formatDateToFullYearDashMonthDashDay = (date: any) => {
  const parsedDate = checkDateAndConvert(date);
  if (!parsedDate) return '';
  return format(parsedDate, `yyyy-LL-dd`, {
    locale: getLocaleObject(i18next.language),
  });
};

export const formatDateToMonthSlashDaySlashFullYear = (date: any) => {
  const parsedDate = checkDateAndConvert(date);
  if (!parsedDate) return '';
  return format(parsedDate, `d/L/yyyy`, {
    locale: getLocaleObject(i18next.language),
  });
};

export const formatDateToMonthDayFullYear = (date: any) => {
  const parsedDate = checkDateAndConvert(date);
  if (!parsedDate) return '';
  return format(parsedDate, `ddMMyyyy`, {
    locale: getLocaleObject(i18next.language),
  });
};

export const formatDateToMonthDotDayDotFullYear = (date: any) => {
  const parsedDate = checkDateAndConvert(date);
  if (!parsedDate) return '';
  return format(parsedDate, `d.L.yyyy`, {
    locale: getLocaleObject(i18next.language),
  });
};

export const checkDateAndConvert = (date: any): Date | null => {
  if (date) {
    if (date instanceof Date) {
      return date;
    } else {
      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        return parsedDate;
      }
      return null;
    }
  }
  return null;
};

export const getHourMinutes = (date: any): string => {
  const parsedDate = checkDateAndConvert(date);
  if (!parsedDate) return '';
  return format(parsedDate, `H:mm '${i18next.t('common:hour')}'`, {
    locale: getLocaleObject(i18next.language),
  });
};

export const getDayName = (date: any): string => {
  const parsedDate = checkDateAndConvert(date);
  if (!parsedDate) return '';
  return format(parsedDate, `EEEE`, {
    locale: getLocaleObject(i18next.language),
  });
};

export const addDays = (date: any, days: number): Date => {
  const parsedDate = checkDateAndConvert(date);
  if (parsedDate) {
    return add(parsedDate, {
      days: days,
    });
  }
  return new Date();
};

export const subtractDays = (date: any, days: number): Date => {
  const parsedDate = checkDateAndConvert(date);
  if (parsedDate) {
    return sub(parsedDate, {
      days: days,
    });
  }
  return new Date();
};

export const convertDateToUTC = (date: any): string | null => {
  const parsedDate = checkDateAndConvert(date);
  if (parsedDate) {
    return formatISO(parsedDate);
  }
  return null;
};

export const convertDateWithoutTime = (selectedDate: Date): string | null => {
  if (!selectedDate) return null;
  const year = getYear(selectedDate);
  const month = getMonth(selectedDate) + 1;
  const date = getDate(selectedDate);
  return `${year}-${month < 10 ? `0${month}` : month}-${
    date < 10 ? `0${date}` : date
  }`;
};

export const convertDateTimeInUTCFormat = (
  selectedDate: Date,
): string | null => {
  if (!selectedDate) return null;
  const year = getYear(selectedDate);
  const month = getMonth(selectedDate) + 1;
  const date = getDate(selectedDate);
  const hours = getHours(selectedDate);
  const minutes = getMinutes(selectedDate);
  return `${year}-${month < 10 ? `0${month}` : month}-${
    date < 10 ? `0${date}` : date
  }T${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:00`;
};

export const convertStringDateToDate = (
  date: string | undefined | null,
): Date | string => {
  if (date) {
    return parseISO(date);
  }
  return '';
};

export const removeTimeFromDate = (date: Date): Date => {
  return setHours(setMinutes(setSeconds(setMilliseconds(date, 0), 0), 0), 0);
};

export const isDateValid = (date: string): boolean => {
  if (date) {
    const parsedDate = parseISO(date);
    return isValid(parsedDate);
  }
  return false;
};

export const getWeekNumber = (date: any): number => {
  const parsedDate = checkDateAndConvert(date);
  if (!parsedDate) return -1;
  return getWeek(parsedDate);
};

export const isPastDate = (date: Date): boolean => {
  return isPast(date);
};
