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

import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

// Material UI
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@material-ui/core';

// Material Icons
import { DeleteOutline as DeleteOutlineIcon } from '@material-ui/icons';

// Custom components
import LoadingSwapComponent from 'components/loaders/LoadingSwapComponent';
import DeleteTestingPersonalModal from 'components/Modals/DeleteTestingPersonalModal';
import withErrorHandler from 'components/Wrappers/ErrorBoundaryWrapper';

// Actions
import {
  getLaboratoryTestingPersonal,
  getTestingPersonalStatusTypesList,
} from 'redux/laboratoryAdministration/laboratoryAdministrationTestingPersonal/organizationAdministrationTestingPersonalSlice';

// Utils
import { RootState } from 'redux/combineReducers';

type WorkingAreaType = 'Pooling' | 'Labor' | 'Admin';

const LabCapacityOverviewTable: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [
    showDeleteTestingPersonalModal,
    setShowDeleteTestingPersonalModal,
  ] = useState<boolean>(false);
  const [deleteTestingPersonalItem, setDeleteTestingPersonalItem] = useState();

  const testingPersonalTableStatus = useSelector(
    (state: RootState) =>
      state.laboratoryTestingPersonalData.getLaboratoryTestingPersonalStatus,
  );

  const testingPersonalTableData = useSelector(
    (state: RootState) =>
      state.laboratoryTestingPersonalData.testingPersonalsTableData,
  );

  const testingPersonalStatus = useSelector(
    (state: RootState) =>
      state.laboratoryTestingPersonalData.addLaboratoryTestingPersonalStatus,
  );

  const testingPersonalStatusTypesList = useSelector(
    (state: RootState) =>
      state.laboratoryTestingPersonalData.testingPersonalStatusTypes,
  );

  const testingPersonalStatusTypeListsStatus = useSelector(
    (state: RootState) =>
      state.laboratoryTestingPersonalData
        .getLaboratoryTestingPersonStatusTypesListStatus,
  );

  useLayoutEffect(() => {
    dispatch(getTestingPersonalStatusTypesList());
  }, []);

  useEffect(() => {
    if (testingPersonalStatusTypeListsStatus.success) {
      dispatch(getLaboratoryTestingPersonal());
    }
  }, [testingPersonalStatusTypeListsStatus]);

  useEffect(() => {
    if (testingPersonalStatus.success) {
      dispatch(getLaboratoryTestingPersonal());
    }
  }, [testingPersonalStatus]);

  const onDeleteHandler = (person: any) => {
    setShowDeleteTestingPersonalModal(true);
    setDeleteTestingPersonalItem(person);
  };

  const onCloseDeleteModal = () => {
    setShowDeleteTestingPersonalModal(false);
    setDeleteTestingPersonalItem(undefined);
  };

  const onSuccessDeleteModal = () => {
    dispatch(getLaboratoryTestingPersonal());
  };

  const responseWorkingAreas =
    testingPersonalTableData?.result?.map((item: any) => {
      const workingAreas = [];
      workingAreas[0] =
        item.workingAreas.find((workArea: any) => workArea.area === 'Pooling')
          ?.area || '';
      workingAreas[1] =
        item.workingAreas.find((workArea: any) => workArea.area === 'Labor')
          ?.area || '';
      workingAreas[2] =
        item.workingAreas.find((workArea: any) => workArea.area === 'Admin')
          ?.area || '';

      return workingAreas;
    }) || [];

  const tableHeaders = [
    {
      headName: 'firstName',
      title: t('common:First name'),
    },
    {
      headName: 'lastName',
      title: t('common:Last name'),
    },
    {
      headName: 'email',
      title: t('common:Email'),
    },
    {
      headName: 'statusId',
      title: t('common:Status'),
    },
    {
      headName: 'employer',
      title: t('common:Employed by'),
    },
    {
      headName: 'workingAreas',
      title: t('common:Working area'),
    },
    {
      headName: 'workingAreas',
      title: t('common:Working area'),
    },
    {
      headName: 'workingAreas',
      title: t('common:Working area'),
    },
  ];

  let text = '';
  if (testingPersonalStatusTypeListsStatus.requesting) {
    text = t('progressMessages:Loading testing personal view data');
  }
  if (testingPersonalTableStatus.requesting) {
    text = t('progressMessages:Loading testing personal view data');
  }

  return (
    <>
      <LoadingSwapComponent
        isLoading={
          testingPersonalStatusTypeListsStatus.requesting ||
          testingPersonalTableStatus.requesting
        }
        withGrid
        text={text}>
        <Paper>
          <TableContainer>
            <Table stickyHeader aria-label="testing-personal-table">
              <TableHead className="table-header-shadow">
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableCell key={index}>
                      <Typography>{t(`common:${header.title}`)}</Typography>
                    </TableCell>
                  ))}
                  <TableCell>{t('common:Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testingPersonalTableData?.result?.map(
                  (item: any, i: number) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.firstName}</TableCell>
                      <TableCell>{item.lastName}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        {
                          testingPersonalStatusTypesList.find(
                            (status) => status.id === item.statusId,
                          )?.name
                        }
                      </TableCell>
                      <TableCell>{item.employeer}</TableCell>
                      {responseWorkingAreas[i].map((el: any) => {
                        return <TableCell key={el}>{el}</TableCell>;
                      })}
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => onDeleteHandler(item)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        {showDeleteTestingPersonalModal && (
          <DeleteTestingPersonalModal
            deleteData={deleteTestingPersonalItem}
            onClose={onCloseDeleteModal}
            onSuccess={onSuccessDeleteModal}
          />
        )}
      </LoadingSwapComponent>
    </>
  );
};

export default withErrorHandler(LabCapacityOverviewTable);
