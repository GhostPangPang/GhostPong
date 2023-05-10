import React from 'react';
import { Text } from '@/common/Text';
import { Grid } from '@/layout/Grid';
import { Box } from '@/common/Box';

export interface InfoBoxProps {
  title: string;
  desc: string;
  subDesc?: string;
  component?: React.ReactNode;
}

export const InfoBox = ({ title, desc, subDesc, component }: InfoBoxProps) => {
  return (
    <Box as="section">
      <Grid
        container="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={1.5}
        size={{ padding: 3.6, width: '32rem' }}
      >
        {component}
        <Grid
          container="flex"
          direction="column"
          justifyContent="center"
          alignItems="start"
          rowGap={1.5}
          size={{ height: '12rem' }}
        >
          <Text size="lg">{title}</Text>
          <Grid container="flex" direction="row" justifyContent="start" alignItems="end" columnGap={2.5}>
            <Text size="xxl">{desc}</Text>
            {subDesc && <Text size="xxs">{subDesc}</Text>}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
