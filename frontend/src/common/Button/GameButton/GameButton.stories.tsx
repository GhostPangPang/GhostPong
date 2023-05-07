import type { StoryObj } from '@storybook/react';
import { GameButton } from './GameButton';

const meta = {
  title: 'Common/Button/GameButton',
  component: GameButton,
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
    href: 'https://naver.com',
  },
};

export const Korean: Story = {
  args: {
    as: 'button',
    size: 'md',
    children: '차단',
  },
};
