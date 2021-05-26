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
/* eslint-disable @typescript-eslint/no-var-requires */
import { configureStore, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { ThunkAction } from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer, { RootState } from './combineReducers';
import { Env } from 'utils/environment';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authData'],
};

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) => {
    // if (Env.get() === 'development') {
    //   return getDefaultMiddleware().prepend().concat(logger);
    // }
    return getDefaultMiddleware();
  },
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
