import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarProps } from './Avatar';

const meta = {
  title: 'Common/Avatar',
  component: Avatar,
} as Meta<AvatarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg',
    alt: 'default_name',
    size: 'md',
  },
};
