import { Meta } from '@storybook/react';
import { Badge, BadgeProps } from './Badge';
import { Avatar } from '../Avatar';

export default {
  title: 'Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
} as Meta;

export const Default = (props: BadgeProps) => (
  <Badge {...props}>
    <Avatar size="md" onClick={props.onClick} />
  </Badge>
);

export const AvatarSm = (props: BadgeProps) => (
  <Badge {...props}>
    <Avatar size="sm" onClick={props.onClick} />
  </Badge>
);
