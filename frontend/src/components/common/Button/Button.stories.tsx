import type { StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Common/Button',
  component: Button,
  argTypes: {},
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    children: 'Button',
  },
};

export const Link: Story = {
  args: {
    as: 'a',
    size: 'md',
    children: 'Button',
  },
};

export const Korean: Story = {
  args: {
    as: 'a',
    size: 'md',
    children: '차단',
  },
};
