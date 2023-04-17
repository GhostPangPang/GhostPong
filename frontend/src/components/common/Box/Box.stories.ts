import type { StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta = {
  title: 'Common/Box',
  component: Box,
  argTypes: {},
  parameters: {},
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: '20rem',
    height: '20rem',
  },
};
