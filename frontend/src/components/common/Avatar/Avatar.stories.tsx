import { Meta } from '@storybook/react';
import { Avatar, AvatarProps } from './Avatar';

export default {
  title: 'Avatar',
  component: Avatar,
} as Meta;

export const Default = (args: AvatarProps) => <Avatar {...args} />;
