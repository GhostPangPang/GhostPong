import type { StoryObj } from '@storybook/react';
import { GameInput } from './GameInput';

const meta = {
  title: 'Common/GameInput',
  component: GameInput,
  argTypes: {},
  parameters: {},
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sizes: 'md',
  },
};
