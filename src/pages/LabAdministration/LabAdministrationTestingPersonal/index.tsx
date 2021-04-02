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

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteProps } from 'react-router-dom';

// Material UI
import { Grid, Button, Typography } from '@material-ui/core';

// Material Icons
import { AddCircleOutline as AddCircleOutlineIcon } from '@material-ui/icons';

// Custom components
import PageContainerWithHeader from 'components/PageContainerWithHeader';
import AddTestingPersonalModal from 'components/Modals/AddTestingPersonalModal';
import LabTestingPersonalTable from 'components/Tables/LabTestingPersonalTable';

// Utils
import { LabAdministrationRoutes } from 'config/routes';

type AdministrationTestingPersonalType = RouteProps;

const AdministrationTestingPersonal: React.FC<AdministrationTestingPersonalType> = () => {
  const { t } = useTranslation();

  const [
    showAddTestingPersonalModal,
    setShowAddTestingPersonalModal,
  ] = useState<boolean>(false);

  const onOpenAddTestingPersonalModal = () => {
    setShowAddTestingPersonalModal(true);
  };

  const onCloseAddTestingPersonalModal = () => {
    setShowAddTestingPersonalModal(false);
  };

  return (
    <>
      <PageContainerWithHeader
        title={LabAdministrationRoutes.testingPersonalRoute.title}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center">
              <Grid item>
                <Button
                  color="secondary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={onOpenAddTestingPersonalModal}>
                  <Typography>{t('common:Add new')}</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <LabTestingPersonalTable />
          </Grid>
        </Grid>
      </PageContainerWithHeader>
      {showAddTestingPersonalModal && (
        <AddTestingPersonalModal onClose={onCloseAddTestingPersonalModal} />
      )}
    </>
  );
};

export default AdministrationTestingPersonal;
