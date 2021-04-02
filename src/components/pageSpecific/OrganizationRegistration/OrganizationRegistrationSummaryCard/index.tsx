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
import { v4 as uuidv4 } from 'uuid';

// Material UI
import { Divider, Grid, Typography } from '@material-ui/core';

// Custom components
import Card from 'components/Card';
import OrganizationSummaryList from 'components/OrganizationSummaryList';

// Utils
import { findCity } from 'utils/findCity';
import { RootState } from 'redux/combineReducers';

// Types
import { OrganizationTypeType } from 'redux/globalTypes';

const OrganizationRegistrationSummaryCard: React.FC = () => {
  const { t } = useTranslation();

  const organizationData = useSelector(
    (state: RootState) => state.organizationRegistrationData.data,
  );

  const citiesList = useSelector((state: RootState) => state.cities.cities);

  const organizationsList = useSelector(
    (state: RootState) => state.organizationTypes.organizationTypes,
  );

  const foundCity = findCity(citiesList, organizationData.cityId)?.name || '-';

  const getOrganizationName = (id: number): string => {
    if (organizationsList?.length !== 0) {
      const foundOrganization = organizationsList.find(
        (org: OrganizationTypeType) => org.id === id,
      );
      if (foundOrganization) {
        return foundOrganization.name;
      }
    }
    return '';
  };

  return (
    <Card largePadding>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">
            {t('common:Organization details')}
          </Typography>
        </Grid>
        <Grid item>
          <OrganizationSummaryList
            arrayOfItems={[
              {
                mainText: t('common:Name'),
                subText: organizationData.name,
                key: organizationData.name,
              },
              {
                mainText: t('common:Type'),
                subText: `${t(
                  `common:${getOrganizationName(organizationData.typeId)}`,
                )}`,

                key: `typeId-${organizationData.typeId.toString()}`,
              },
              {
                mainText: t('common:City'),
                subText: foundCity || '',
                key: `cityId-${organizationData.cityId || '1'}`,
              },
            ]}
          />
        </Grid>
        <Grid item>
          <Grid container spacing={3}>
            <Grid item>
              <Typography className="bold">
                {t('common:Address for pickup and delivery')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{organizationData.address}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <OrganizationSummaryList
            arrayOfItems={[
              {
                mainText: t('common:ZIP'),
                subText: organizationData.ZIP || '',
                key: organizationData.cityId || '1',
              },
            ]}
          />
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        {organizationData?.contacts?.map((person, index) => {
          return (
            <React.Fragment key={person.phoneNumber}>
              <Grid item>
                <Typography variant={index === 0 ? 'h6' : 'body1'}>{`${
                  index === 0
                    ? t('common:Contact person')
                    : `${t('common:Contact person')} ${index + 1}`
                }`}</Typography>
              </Grid>
              <Grid item>
                <OrganizationSummaryList
                  arrayOfItems={[
                    {
                      mainText: t('common:Name'),
                      subText: person.name,
                      key: `${person.name}-${person.phoneNumber}`,
                    },
                    {
                      mainText: t('common:Land line number'),
                      subText: person.landLineNumber || '',
                      key: person.landLineNumber || uuidv4(),
                    },
                    {
                      mainText: t('common:Mobile phone number'),
                      subText: person.phoneNumber,
                      key: person.phoneNumber,
                    },
                    {
                      mainText: t('common:Email'),
                      subText: person.email,
                      key: person.email,
                    },
                  ]}
                />
              </Grid>
            </React.Fragment>
          );
        })}

        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <Typography variant="h6">{t('common:Testing details')}</Typography>
        </Grid>
        <Grid item>
          <OrganizationSummaryList
            arrayOfItems={[
              {
                mainText: t('common:Number of tests'),
                subText: organizationData.numberOfSamples || '',
                key: `numberOfTests-${organizationData.numberOfSamples}`,
              },
              {
                mainText: t('common:Number of classes/departments'),
                subText: organizationData.numberOfPools || '',
                key: `numberOfTestClasses-${organizationData.numberOfPools}`,
              },
            ]}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default OrganizationRegistrationSummaryCard;
