import type { StoryObj } from '@storybook/react';
import { RankBadge } from './RankBadge';

const meta = {
  title: 'Common/RankBadge',
  component: RankBadge,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rank: 'iron',
  },
};
