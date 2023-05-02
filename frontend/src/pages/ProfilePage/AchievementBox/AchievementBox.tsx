import React from 'react';
import { Grid } from '@/layout/Grid';
import { Box } from '@/common/Box';
import { Text } from '@/common/Text';

export interface AchievementBoxProps {
  children?: React.ReactNode;
}

export const AchievementBox = ({ children }: AchievementBoxProps) => {
  return (
    <Box as="section">
      <Grid
        container="flex"
        direction="column"
        justifyContent="start"
        alignItems="start"
        gap={1.5}
        size={{ height: '100%', padding: 'lg' }}
      >
        <Text size="lg">업적</Text>
        <Grid container="flex" justifyContent="start" alignItems="start" gap={3} size={{ height: '100%' }}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};
