import type { StoryObj } from '@storybook/react';
import { Dropbox } from './Dropbox';
import { Avatar } from '../Avatar';
import { GameButton } from '../Button/GameButton';

const meta = {
  title: 'Common/Dropbox',
  component: Dropbox,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
  decorators: [],
};

const items = [
  { label: '프로필', onClick: () => console.log('프로필 클릭') },
  { label: '메세지', onClick: () => console.log('메세지 클릭') },
  { label: '내 정보 수정', onClick: () => console.log('내 정보 수정 클릭') },
  { label: '로그아웃', onClick: () => console.log('로그아웃 클릭') },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: items,
    placement: 'bottomright',
    children: (
      <Avatar src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" alt="default_name" size="md" />
    ),
  },
};

export const BottomRightSm: Story = {
  args: {
    items: items,
    placement: 'bottomright',
    children: (
      <Avatar src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" alt="default_name" size="sm" />
    ),
  },
};

export const TopLeftSm: Story = {
  args: {
    items: items,
    placement: 'topleft',
    children: (
      <Avatar src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" alt="default_name" size="sm" />
    ),
  },
};

export const SomeDiv: Story = {
  args: {
    items: items,
    placement: 'bottomright',
    children: (
      <div style={{ width: '100px', height: '100px', backgroundColor: 'red', whiteSpace: 'nowrap' }}>Some Div</div>
    ),
  },
};

export const OurGameButtonCheck: Story = {
  args: {
    items: items,
    placement: 'bottomright',
    children: <GameButton size="sm">GameButton</GameButton>,
  },
};

export const ButtonCheck: Story = {
  args: {
    items: items,
    placement: 'bottomright',
    children: <button style={{ height: '10px', backgroundColor: 'red' }}>Some Div</button>,
  },
};
