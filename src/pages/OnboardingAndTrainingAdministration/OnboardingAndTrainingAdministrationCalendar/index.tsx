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
import { RouteProps } from 'react-router-dom';

type OnboardingAndTrainingAdministrationCalendarType = RouteProps;

const OnboardingAndTrainingAdministrationCalendar: React.FC<OnboardingAndTrainingAdministrationCalendarType> = () => {
  return (
    <>
      {/* <iframe
        title="Calendar"
        frameBorder="0"
        height="98%"
        width="100%"
        src="https://kalender.digital/412f07c91ef64afb4977?iframe=true"></iframe> */}
      <iframe
        title="Calendar-edit"
        frameBorder="0"
        height="98%"
        width="100%"
        src="https://kalender.digital/d4edf3b8189664a654f7?iframe=true"></iframe>
    </>
  );
};

export default OnboardingAndTrainingAdministrationCalendar;
