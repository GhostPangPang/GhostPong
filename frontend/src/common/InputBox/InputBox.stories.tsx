import type { StoryObj } from '@storybook/react';
import { InputBox } from './InputBox';

const meta = {
  title: 'Common/InputBox',
  component: InputBox,
  argTypes: {},
  parameters: {},
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { sizes: 'default' },
};
