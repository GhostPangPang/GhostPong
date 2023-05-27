import type { StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { Text } from '@/common';

const meta = {
  title: 'Common/Dropdown',
  component: Dropdown,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => console.log(event.target.value),
    children: (
      <>
        <Text as="option">public</Text>
        <Text as="option">protected</Text>
        <Text as="option">private</Text>
      </>
    ),
  },
};
