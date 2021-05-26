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

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// Material Icons
import {
  Grid,
  Divider,
  IconButton,
  Button,
  List,
  Typography,
} from '@material-ui/core';

// Material Icons
import { Fullscreen as FullScreenIcon } from '@material-ui/icons';

// Custom components
import Card from 'components/Card';
import BasicFormWrapper from 'components/Wrappers/BasicFormWrapper';
import ButtonWithLoadingAnimation from 'components/Buttons/ButtonWithLoadingAnimation';
import TextControllerInput from 'components/FormControllerInputs/TextControllerInput';
import NoteItem from 'components/Notes/NoteItem';

// Actions
import {
  getNotes,
  postNote,
  resetNotes,
} from 'redux/onboardingAndTrainingAdministration/Notes/notesSliceSlice';
import { RootState } from 'redux/combineReducers';

// Types
import { NoteItemType } from 'redux/onboardingAndTrainingAdministration/Notes/types';
import LoadingAnimationOverlay from 'components/loaders/LoadingAnimationOverlay';

type NoteType = {
  note: string;
};

interface INotesProps {
  organizationId: string;
  isExpanded: boolean;
  setExpanded: (value: boolean) => void;
  isReadOnly?: boolean;
}

const Notes: React.FC<INotesProps> = (props: INotesProps) => {
  const { organizationId, isExpanded, setExpanded, isReadOnly } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isInitialLoad, setInitialLoad] = useState<boolean>(true);

  const { control, handleSubmit, errors, reset } = useForm<NoteType>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      note: '',
    },
  });

  const notes = useSelector((state: RootState) => state.notes.notes);

  const notesStatus = useSelector(
    (state: RootState) => state.notes.notesStatus,
  );

  const postNoteStatus = useSelector(
    (state: RootState) => state.notes.postNoteStatus,
  );

  const fetchData = () => {
    dispatch(getNotes({ organizationId }));
  };

  useLayoutEffect(() => {
    fetchData();
    return () => {
      dispatch(resetNotes());
    };
  }, []);

  useEffect(() => {
    if (notesStatus.success) {
      setInitialLoad(false);
    }
  }, [notesStatus]);

  useEffect(() => {
    if (postNoteStatus.success) {
      reset();
      fetchData();
    }
  }, [postNoteStatus]);

  const onSubmitNote = (values: NoteType) => {
    dispatch(
      postNote({
        text: values.note,
        organizationId,
      }),
    );
  };

  let expandedStyles: React.CSSProperties = {};
  if (isExpanded) {
    expandedStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 50,
      height: '100%',
      width: '100%',
    } as React.CSSProperties;
  }

  const isLoading = notesStatus.requesting || postNoteStatus.requesting;

  return (
    <Card
      noPadding
      className="fullHeight"
      style={{
        ...expandedStyles,
      }}>
      <Grid container direction="column" className="fullHeight">
        <Grid item>
          <Grid container>
            <Grid item xs={12}>
              <div className="pl-4 pr-2 pt-1 pb-1">
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>{t('common:Notes')}</Grid>
                  <Grid item>
                    <IconButton
                      aria-label="expand"
                      onClick={() => setExpanded(!isExpanded)}>
                      <FullScreenIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          className="relative"
          style={{
            flexGrow: 1,
          }}>
          <LoadingAnimationOverlay isLoading={isLoading} />
          {/* maxHeight 570px and 490px to force scroll, adjust this height if remove/add fields below */}
          <div
            className="pl-4 pr-4 pt-2 pb-2 overflow-auto"
            style={{ maxHeight: `${isExpanded ? '570px' : '490px'}` }}>
            {!isInitialLoad && (
              <>
                {notes.length !== 0 ? (
                  <List>
                    {notes.map((note: NoteItemType) => (
                      <NoteItem
                        key={note.id}
                        date={note.createdOn}
                        userName={note.creatorName}
                        noteText={note.text}
                      />
                    ))}
                  </List>
                ) : (
                  <Typography>{t('common:There are no notes')}</Typography>
                )}
              </>
            )}
          </div>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <div className="pl-4 pr-4 pt-4 pb-4">
                <BasicFormWrapper>
                  <TextControllerInput
                    control={control}
                    name="note"
                    id="note-input"
                    multiline
                    fieldRequired
                    maxNumberOfCharacter={500}
                    error={Boolean(errors.note?.message)}
                    errorMessage={errors.note?.message}
                    disabled={isReadOnly}
                  />
                </BasicFormWrapper>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="pl-4 pr-4 pb-4">
                <Grid container justify="flex-end" spacing={2}>
                  <Grid item>
                    <ButtonWithLoadingAnimation
                      fullWidth
                      color="primary"
                      variant="contained"
                      disabled={notesStatus.requesting || isReadOnly}
                      isLoading={postNoteStatus.requesting}
                      text={t('common:Submit')}
                      onClick={() => handleSubmit(onSubmitNote)()}
                    />
                  </Grid>
                  <Grid item>
                    <Button onClick={() => reset()}>
                      {t('common:Cancel')}
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Notes;
