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

// Material UI
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@material-ui/core';

type HeadCell = {
  id: string;
  align?: 'left' | 'right';
  label: string;
  disablePadding?: boolean;
  sortable?: boolean;
  hide?: boolean;
};

interface IEnhancedTableHeadProps {
  headCells: HeadCell[];
  onRequestSort: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    property: string,
  ) => void;
  order: 'asc' | 'desc';
  orderBy: string;
}

import styles from './EnhancedTableHead.module.scss';

const EnhancedTableHead: React.FC<IEnhancedTableHeadProps> = (
  props: IEnhancedTableHeadProps,
) => {
  const { order, orderBy, onRequestSort, headCells } = props;

  const createSortHandler = (property: string) => (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="table-header-shadow">
      <TableRow>
        {headCells.map((sortedHeadCell) => {
          if (sortedHeadCell.hide) {
            return null;
          }
          if (sortedHeadCell.sortable) {
            return (
              <TableCell
                key={sortedHeadCell.id}
                align={sortedHeadCell.align || 'left'}
                padding={sortedHeadCell.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === sortedHeadCell.id ? order : false}>
                <TableSortLabel
                  active={orderBy === sortedHeadCell.id}
                  direction={orderBy === sortedHeadCell.id ? order : 'desc'}
                  onClick={createSortHandler(sortedHeadCell.id)}>
                  {sortedHeadCell.label}
                  {orderBy === sortedHeadCell.id ? (
                    <span className={styles.visuallyHidden}>
                      {order === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          }
          return (
            <TableCell
              key={sortedHeadCell.id}
              align={sortedHeadCell.align || 'left'}>
              {sortedHeadCell.label}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
