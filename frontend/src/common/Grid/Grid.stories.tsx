import type { StoryObj } from '@storybook/react';
import { Grid } from './Grid';
import { Box } from '@/common';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FlexRowContainer: Story = {
  args: {
    as: 'section',
    container: 'flex',
    direction: 'row',
    gap: 0.5,
    alignContent: 'center',
    children: (
      <>
        <Box width="10rem" height="10rem" />
        <Box width="10rem" height="10rem" />
        <Box width="10rem" height="10rem" />
      </>
    ),
  },
};

export const FlexColumnContainer: Story = {
  args: {
    as: 'div',
    container: 'flex',
    direction: 'column',
    gap: 0.5,
    children: (
      <>
        <Box width="10rem" height="10rem" />
        <Box width="10rem" height="10rem" />
        <Box width="10rem" height="10rem" />
      </>
    ),
  },
};

export const FlexRatioItems: Story = {
  args: {
    as: 'div',
    container: 'flex',
    gap: 0.5,
    size: {
      width: '500px',
      height: '100px',
    },
    children: (
      <>
        <Grid xs={8}>
          <Box />
        </Grid>
        <Grid xs={4}>
          <Box />
        </Grid>
      </>
    ),
  },
};

export const Grid2DContainer: Story = {
  args: {
    as: 'div',
    container: 'grid',
    gap: 0.5,
    columns: 3,
    rows: 3,
    size: {
      width: '500px',
      height: '100px',
    },
    children: (
      <>
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
      </>
    ),
  },
};

export const GridSpan: Story = {
  args: {
    as: 'div',
    container: 'grid',
    gap: 0.5,
    columns: 3,
    rows: 3,
    size: {
      width: '500px',
      height: '100px',
    },
    children: (
      <>
        <Grid gridRow="1/3">
          <Box />
        </Grid>
        <Grid gridColumn="2/4">
          <Box />
        </Grid>
      </>
    ),
  },
};
