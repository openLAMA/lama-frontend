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

/* eslint-disable global-require */
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { PersistGate } from 'redux-persist/integration/react';
import reportWebVitals from './reportWebVitals';

// Multi language
import 'translation/i18n';

// Store
import store, { persistor } from 'redux/store';

// Material
import {
  createMuiTheme,
  StylesProvider,
  ThemeProvider,
} from '@material-ui/core';

// Custom components
import GlobalLoadingAnimation from 'components/loaders/GlobalLoadingAnimation';
import SnackBarView from 'components/SnackBarView';
import ErrorBoundary from 'components/ErrorBoundary';

// Types
import { SnackbarDataType } from 'redux/snackbar/types';

import '@fontsource/roboto';
import './index.scss';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#EE2629',
    },
    secondary: {
      main: '#2196f3',
    },
  },
});

const render = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const App = require('./App').default;

  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<GlobalLoadingAnimation />}>
          <Provider store={store}>
            <ErrorBoundary>
              <StylesProvider injectFirst>
                <PersistGate loading={null} persistor={persistor}>
                  <SnackbarProvider
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    content={(key: string, message: SnackbarDataType) => {
                      return (
                        <div>
                          <SnackBarView id={key} data={message} />
                        </div>
                      );
                    }}>
                    <App />
                  </SnackbarProvider>
                </PersistGate>
              </StylesProvider>
            </ErrorBoundary>
          </Provider>
        </Suspense>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
};

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
