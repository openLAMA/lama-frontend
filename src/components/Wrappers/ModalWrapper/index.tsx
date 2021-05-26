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

// Material UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Grid,
} from '@material-ui/core';

interface IModalWrapperProps {
  isOpen?: boolean;
  title: string;
  onSave?: (event: any) => void;
  onAccept?: (event: any) => void;
  onOK?: (event: any) => void;
  onDone?: (event: any) => void;
  onCancel?: (event: any) => void;
  onDelete?: (event: any) => void;
  onSend?: (event: any) => void;
  loading?: boolean;
  dialogWidth?: string;
  minHeight?: string;
  disabledSaveButton?: boolean;
  disabledSendButton?: boolean;
  type: 'error' | 'warning' | 'primary';
  children: React.ReactNode;
}

import styles from './ModalWrapper.module.scss';

const ModalWrapper: React.FC<IModalWrapperProps> = (
  props: IModalWrapperProps,
) => {
  const {
    isOpen,
    title,
    onSave,
    onAccept,
    onOK,
    onDone,
    onCancel,
    onDelete,
    onSend,
    loading,
    dialogWidth,
    minHeight,
    disabledSaveButton,
    disabledSendButton,
    children,
    type,
  } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth={false}
      aria-labelledby="confirmation-dialog"
      open={Boolean(isOpen)}
      className={styles['dialog-root']}
      classes={{ paper: styles['paper-root'] }}
      PaperProps={{
        style: { width: dialogWidth },
      }}>
      {loading && (
        <div className={styles['loading-overlay']}>
          <CircularProgress />
        </div>
      )}
      <DialogTitle
        id="confirmation-dialog"
        className={`${styles[`modal-header-color-${type}`]} color-white`}>
        {title}
      </DialogTitle>
      <DialogContent
        dividers
        className={styles['dialog-content']}
        style={{ minHeight }}>
        <Grid
          container
          className={`${styles['modal-grid-container-spacing']} ${styles['modal-min-content-size']} pt-3 pb-3`}>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {onCancel && (
          <Button onClick={onCancel} color="default">
            {t('common:Cancel')}
          </Button>
        )}
        {onSave && (
          <Button
            variant="contained"
            onClick={onSave}
            color="primary"
            className={styles[`button-${type}`]}
            disabled={loading || disabledSaveButton}>
            {t('common:Save')}
          </Button>
        )}
        {onAccept && (
          <Button
            variant="contained"
            onClick={onAccept}
            color="primary"
            className={styles[`button-${type}`]}
            disabled={loading}>
            {t('common:Accept')}
          </Button>
        )}
        {onDelete && (
          <Button
            variant="contained"
            onClick={onDelete}
            className={styles[`button-${type}`]}
            disabled={loading}>
            {t('common:Delete')}
          </Button>
        )}
        {onOK && (
          <Button
            variant="contained"
            onClick={onOK}
            color="primary"
            className={styles[`button-${type}`]}
            disabled={loading}>
            {t('common:OK')}
          </Button>
        )}
        {onDone && (
          <Button
            variant="contained"
            onClick={onDone}
            color="primary"
            className={styles[`button-${type}`]}
            disabled={loading}>
            {t('common:Done')}
          </Button>
        )}
        {onSend && (
          <Button
            variant="contained"
            onClick={onSend}
            color="primary"
            className={styles[`button-${type}`]}
            disabled={loading || disabledSendButton}>
            {t('common:Send')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalWrapper;
