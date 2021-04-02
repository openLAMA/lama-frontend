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
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';

// Material UI
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Toolbar,
  Grid,
  Divider,
} from '@material-ui/core';

// Material icons
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@material-ui/icons';

// Logos
import baselLandshaftLogo from 'assets/basel-landschaft.logo.svg';

// Actions
import { setDrawerOpen } from 'redux/globalState/navDrawer/navDrawerSlice';

import { RootState } from 'redux/combineReducers';

import styles from './NavDrawer.module.scss';

interface INavItem {
  name: string;
  path: string;
  icon: React.ReactElement<any>;
}

interface INavDrawerProps {
  navItems: INavItem[];
}

const NavDrawer: React.FC<INavDrawerProps> = (props: INavDrawerProps) => {
  const { navItems } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { isDrawerOpen } = useSelector((state: RootState) => state.navDrawer);

  const redirectTo = (path: string) => {
    history.push(path);
  };

  const handleDrawerOpenClose = () => {
    dispatch(setDrawerOpen(!isDrawerOpen));
  };

  return (
    <>
      <Drawer
        variant="permanent"
        className={`${styles.drawer} ${
          isDrawerOpen ? styles['drawer-open'] : styles['drawer-close']
        }`}
        classes={{
          paper: `${styles['drawer-paper']} ${
            isDrawerOpen ? styles['drawer-open'] : styles['drawer-close']
          }`,
        }}>
        <Toolbar />
        <Grid
          container
          className="fullHeight"
          direction="column"
          justify="space-between">
          <Grid item>
            <List>
              <ListItem
                button
                onClick={handleDrawerOpenClose}
                className={styles['drawer-open-close-icon-container']}>
                <ListItemIcon className={styles['drawer-open-close-icon']}>
                  {isDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </ListItemIcon>
              </ListItem>
              {navItems.map((item) => {
                const isSelected = location && location.pathname === item.path;
                return (
                  <ListItem
                    button
                    key={item.name}
                    className={`${
                      isSelected ? styles['drawer-item-active'] : ''
                    }`}
                    onClick={() => redirectTo(item.path)}>
                    <ListItemIcon>
                      {React.cloneElement(item.icon, {
                        className: `${
                          isSelected ? styles['drawer-item-active-icon'] : ''
                        }`,
                      })}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          className={`${
                            isSelected ? styles['drawer-item-active-text'] : ''
                          }`}>
                          {t(`common:${item.name}`)}
                        </Typography>
                      }
                    />
                    {isSelected && <div className={styles['drawer-item']} />}
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Divider />
              </Grid>
              <Grid item>
                <img
                  className="fullWidth pl-12 pt-8 pr-12 pb-8"
                  src={baselLandshaftLogo}
                  alt="basel Landshaft Logo"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
};

export default NavDrawer;
