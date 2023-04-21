import { Meta } from '@storybook/react';
import { Badge, BadgeProps } from './Badge';
import { Avatar } from '../Avatar';

export default {
  title: 'Badge',
  component: Badge,
} as Meta;

export const Default = (props: BadgeProps) => (
  <Badge {...props}>
    <Avatar size={props.size} onClick={props.onClick} />
  </Badge>
);
