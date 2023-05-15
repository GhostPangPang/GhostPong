import type { StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta = {
  title: 'Common/Toggle',
  component: Toggle,
  argTypes: {},
  parameters: {},
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    toggle: true,
    onChange: () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    },
  },
};
