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
import { withTranslation, WithTranslation } from 'react-i18next';

// Material
import { Container, Grid, Paper, Typography } from '@material-ui/core';

interface IErrorBoundaryState {
  error?: Error;
}

interface IErrorBoundaryProps extends WithTranslation {
  children: React.ReactNode;
  isComponentError?: boolean;
}

import styles from './ErrorBoundary.module.scss';

class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error: Error): void {
    this.setState({
      error,
    });
  }

  render(): React.ReactNode {
    const { error } = this.state;
    const { children, isComponentError } = this.props;
    if (isComponentError && error) {
      return (
        <Grid container className="fullWidth">
          <Grid item xs={12}>
            <Paper className={styles['component-paper']}>
              <Typography className={styles.text} variant="h4">
                This component failed to show.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      );
    }
    return error ? (
      <Container className={styles.container}>
        <Grid
          container
          className={styles['grid-container']}
          justify="center"
          alignItems="center">
          <Grid item>
            <Paper className={styles.paper}>
              <Typography className={styles.text} variant="h4">
                {this.props.t('common:Error boundary message')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    ) : (
      children
    );
  }
}

export default withTranslation()(ErrorBoundary);
