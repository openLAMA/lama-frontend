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
 * You 
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';

// Material components
import {
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  Box,
} from '@material-ui/core';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@material-ui/icons';

// ActionCreators
import {
  convertSecretFile,
  clearConvertSecretFileData,
} from 'redux/logisticsAdministration/logisticsAdministrationDashboard/logisticsAdministrationDashboardSlice';

// Utils
import { RootState } from 'redux/combineReducers';

import styles from './TemporaryFileUpload.module.scss';

const TemporaryFileUpload: React.FC = () => {
  const dispatch = useDispatch();

  const [fileForUpload, setFileForUpload] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const uploadProgress = useSelector(
    (state: RootState) =>
      state.logisticsAdministrationDashboard.convertSecretFileProgress,
  );

  const convertSecretFileStatus = useSelector(
    (state: RootState) =>
      state.logisticsAdministrationDashboard.convertSecretFileStatus,
  );

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept:
      '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    noClick: true,
    disabled: Boolean(fileForUpload),
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (!fileForUpload && acceptedFiles.length !== 0) {
        setFileForUpload(acceptedFiles[0]);
      }
    },
  });

  const isFileAccepted = Boolean(fileForUpload);

  useEffect(() => {
    return () => {
      dispatch(clearConvertSecretFileData());
    };
  }, []);

  useEffect(() => {
    if (fileForUpload) {
      const data = {
        doc_file: fileForUpload,
      };
      dispatch(convertSecretFile(data));
    }
  }, [fileForUpload]);

  useEffect(() => {
    if (uploadProgress && uploadProgress === 100) {
      setTimeout(() => {
        setProcessing(true);
      }, 500);
    }
  }, [uploadProgress]);

  const handleOnRestart = () => {
    setFileForUpload(null);
    setProcessing(false);
    dispatch(clearConvertSecretFileData());
  };

  return (
    <div {...getRootProps()} className={styles['drop-file-wrapper']}>
      <input {...getInputProps()} />
      <Grid
        container
        alignContent="center"
        justify="center"
        className={`${styles['upload-icon-container']} ${
          isFileAccepted ? styles['drag-accepted'] : ''
        } `}>
        <Grid item xs={12}>
          <IconButton
            component="span"
            color="primary"
            aria-label="browse files"
            onClick={open}
            className={`
                  ${styles['button-animation-wrapper']}
                  ${
                    !isDragActive && !isFileAccepted
                      ? styles['button-animation']
                      : ''
                  }
                  ${isDragActive ? styles['drag-active'] : ''}
                    ${isDragAccept ? styles['drag-accept'] : ''} ${
              isDragReject ? styles['drag-reject'] : ''
            }
                    ${isFileAccepted ? styles['drag-accepted'] : ''}
                `}>
            <CloudUploadIcon className={`${styles['upload-icon']}`} />
          </IconButton>
          {isFileAccepted && !convertSecretFileStatus.success && (
            <Box
              className={`${styles['percentage-upload-container']} ${
                convertSecretFileStatus.failure ? styles['upload-failed'] : ''
              }`}>
              <CircularProgress
                size={processing ? 136 : 112}
                thickness={processing ? 2 : 3}
                value={processing ? 0 : uploadProgress}
                variant={processing ? 'indeterminate' : 'determinate'}
              />
              <Box className={styles['percentage-upload']}>
                {processing ? (
                  <Typography
                    variant="caption"
                    component="div"
                    color="textPrimary"
                    className={styles['processing-text']}>
                    Processing
                  </Typography>
                ) : (
                  <Typography
                    variant="caption"
                    component="div"
                    color="textSecondary"
                    className={styles['percentage-text']}>{`${Math.round(
                    uploadProgress,
                  )}%`}</Typography>
                )}
              </Box>
            </Box>
          )}
          {convertSecretFileStatus.success && (
            <div className={styles['upload-complete-container']}>
              <div className={styles['upload-complete-container-clip']} />
              <div
                className={`relative ${styles['upload-refresh-icon-container']}`}>
                <ErrorIcon className={`${styles['dummy-icon']}`} />
                <CheckCircleIcon
                  className={`${styles['upload-complete-icon']}`}
                />
                <RefreshIcon
                  onClick={() => handleOnRestart()}
                  className={`${styles['refresh-icon']}`}
                />
              </div>
            </div>
          )}
          <div
            className={`relative ${styles['upload-error-container']} ${
              convertSecretFileStatus.failure &&
              styles['upload-error-container-animation-in']
            }`}>
            <div
              className={`relative ${styles['upload-refresh-icon-container']}`}>
              <ErrorIcon className={`${styles['dummy-icon']}`} />
              <ErrorIcon className={`${styles['upload-error-icon']}`} />
              <RefreshIcon
                onClick={() => handleOnRestart()}
                className={`${styles['refresh-icon']}`}
              />
            </div>

            <Typography
              className={styles['error-text']}
              align="center"
              component="span">
              Failed to upload file!
            </Typography>
          </div>
        </Grid>

        <Typography
          variant="h5"
          component="h5"
          noWrap
          color="primary"
          className={`${styles['upload-text']} ${
            isFileAccepted ? styles['drag-accepted'] : ''
          }`}>
          Drag & Drop
        </Typography>
        <Typography
          variant="caption"
          component="span"
          noWrap
          color="textSecondary"
          className={`${styles['subtitle-text']} ${
            isFileAccepted ? styles['drag-accepted'] : ''
          }`}>
          Accepts only &apos;Word Documents&apos;
        </Typography>
      </Grid>
    </div>
  );
};

export default TemporaryFileUpload;
