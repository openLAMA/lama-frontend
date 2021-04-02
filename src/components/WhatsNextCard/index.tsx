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
import { Typography, Grid } from '@material-ui/core';

// Custom components
import Card from 'components/Card';

type NextItemType = {
  title: string;
  text: string;
};

interface IWhatsNextCardProps {
  whatsNextItems: NextItemType[];
}

const WhatsNextCard: React.FC<IWhatsNextCardProps> = (
  props: IWhatsNextCardProps,
) => {
  const { whatsNextItems } = props;
  const { t } = useTranslation();

  return (
    <Card largePadding>
      <Grid container direction="column" spacing={4} wrap="nowrap">
        <Grid item xs={12}>
          <Typography variant="h5" align="center">{`${t(
            "common:What's next",
          )}?`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="column" spacing={2} wrap="nowrap">
            {whatsNextItems.map((item, index) => (
              <Grid key={item.title} item>
                <Grid container direction="column" spacing={1} wrap="nowrap">
                  <Grid item xs={12}>
                    <Typography className="bold">
                      {`${index + 1}.${item.title}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography paragraph>{item.text}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default WhatsNextCard;
