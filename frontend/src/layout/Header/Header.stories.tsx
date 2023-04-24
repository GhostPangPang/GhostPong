import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta = {
  title: 'Layout/Header',
  component: Header,
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    nickname: 'John Doe',
    image: 'https://avatars.githubusercontent.com/u/1234567?v=4',
    exp: 100,
    items: [
      { label: '프로필', onClick: () => console.log('프로필 클릭') },
      { label: '메세지', onClick: () => console.log('메세지 클릭') },
      { label: '내 정보 수정', onClick: () => console.log('내 정보 수정 클릭') },
      { label: '로그아웃', onClick: () => console.log('로그아웃 클릭') },
    ],
  },
};
