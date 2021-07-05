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
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

// Material UI
import {
  AppBar,
  Button,
  IconButton,
  Grid,
  Toolbar,
  Tooltip,
} from '@material-ui/core';

// Material Icons
import { PowerSettingsNew as PowerSettingsNewIcon } from '@material-ui/icons';

// Custom components
import CompanyLogo from 'components/CompanyLogo';
import ProfileIcon from 'components/ProfileIcon';

// Actions
import { clearAuthData } from 'redux/authData/authDataSlice';
import {
  setOnChangeLanguage,
  setOnChangeLanguageComplete,
} from 'redux/globalState/languageState/languageStateSlice';

// Utils
import { RootState } from 'redux/combineReducers';
import { Env } from 'utils/environment';

// Routes
import { UnauthenticatedRoutes } from 'config/routes';

import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const userData = useSelector((state: RootState) => state.authData.userData);

  const onSignOut = () => {
    dispatch(clearAuthData());
    history.push(UnauthenticatedRoutes.loginRoute.route);
  };

  const changeLang = () => {
    if (i18n.language === 'en-US') {
      dispatch(setOnChangeLanguage());
      i18n.changeLanguage('de').then(() => {
        dispatch(setOnChangeLanguageComplete());
      });
    } else {
      dispatch(setOnChangeLanguage());
      i18n.changeLanguage('en-US').then(() => {
        dispatch(setOnChangeLanguageComplete());
      });
    }
  };

  return (
    <div className={styles.root}>
      <AppBar position="fixed" className={styles['app-bar']}>
        <Toolbar className={styles['logo-align-is-more-important']}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <div className={styles['nav-bar-logo']}>
                <Link to="/">
                  <CompanyLogo padding="12px 6px" maxWidth="100px" />
                </Link>
              </div>
            </Grid>
            <Grid item>
              <Grid container spacing={1} alignItems="center">
                {Env.get() === 'development' && (
                  <Grid item>
                    <Button onClick={changeLang}>Change lang</Button>
                  </Grid>
                )}
                <Grid item>
                  <ProfileIcon name={userData?.name} />
                </Grid>

                <Grid item>
                  <Tooltip title={`${t('common:Logout')}`} enterDelay={300}>
                    <IconButton color="secondary" onClick={onSignOut}>
                      <PowerSettingsNewIcon style={{ paddingBottom: '2px' }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
