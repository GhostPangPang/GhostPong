import type { Meta, StoryObj } from '@storybook/react';
import { LobyPage } from './LobyPage';

const meta = {
  title: 'Common/LobyPage',
  component: LobyPage,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaults: Story = {
  args: {},
};
