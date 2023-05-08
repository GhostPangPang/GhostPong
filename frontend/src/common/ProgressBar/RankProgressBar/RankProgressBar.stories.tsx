import type { StoryObj } from '@storybook/react';
import { RankProgressBar } from './RankProgressBar';

const meta = {
  title: 'Common/ProgressBar/RankProgressBar',
  component: RankProgressBar,
  argTypes: {},
  parameters: {},
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exp: 124,
  },
};
