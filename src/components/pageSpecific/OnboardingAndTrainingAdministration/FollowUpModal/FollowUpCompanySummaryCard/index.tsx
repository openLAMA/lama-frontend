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
import { useSelector } from 'react-redux';

// Material UI
import { Grid, Typography } from '@material-ui/core';

// Custom components
import Card from 'components/Card';
import OrganizationSummaryList from 'components/OrganizationSummaryList';

// Utils
import { RootState } from 'redux/combineReducers';

const FollowUpCompanySummaryCard: React.FC = () => {
  const { t } = useTranslation();

  const programMember = useSelector(
    (state: RootState) => state.editProgramMemberData.programMember,
  );

  return (
    <Card largePadding>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">{t('common:SME summary')}</Typography>
        </Grid>
        <Grid item>
          <OrganizationSummaryList
            arrayOfItems={[
              {
                mainText: t('common:Epaad id'),
                subText: programMember.epaadId || 'N/A',
                key: `1-${programMember.epaadId || '1'}`,
              },
              {
                mainText: t('common:Support person'),
                subText:
                  programMember.supportPerson.name ||
                  `${t('common:Missing, please fill!')}`,
                key: `2-${programMember.supportPerson.name || '2'}`,
                error: !Boolean(programMember.supportPerson.name),
              },
              {
                mainText: t('common:Email'),
                subText:
                  programMember.supportPerson.email ||
                  `${t('common:Missing, please fill!')}`,
                key: `2-${programMember.supportPerson.email || '3'}`,
                error: !Boolean(programMember.supportPerson.email),
              },
              {
                mainText: t('common:Organization key'),
                subText: programMember.organizationShortcutName || 'N/A',
                key: `3-${programMember.organizationShortcutName || '4'}`,
                error: false,
              },
            ]}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default FollowUpCompanySummaryCard;
