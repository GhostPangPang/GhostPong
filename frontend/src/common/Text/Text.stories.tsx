import type { StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'Common/Text',
  component: Text,
  argTypes: {},
  parameters: {},
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Hello World',
  },
};
