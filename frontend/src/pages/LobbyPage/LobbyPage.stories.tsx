import type { StoryObj } from '@storybook/react';
import { LobbyPage } from './LobbyPage';

const meta = {
  title: 'Common/LobyPage',
  component: LobbyPage,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaults: Story = {
  args: {},
};
