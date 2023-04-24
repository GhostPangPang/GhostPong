import { describe, test, expect } from 'vitest';
import { render } from '@/test';
import { Header } from './Header';

describe('Header', () => {
  test('should render successfully', () => {
    const meta = {
      nickname: 'Test',
      image: 'https://avatars.githubusercontent.com/u/48207131?v=4',
      exp: 100,
      items: [
        { label: '프로필', onClick: () => console.log('프로필 클릭') },
        { label: '메세지', onClick: () => console.log('메세지 클릭') },
        { label: '내 정보 수정', onClick: () => console.log('내 정보 수정 클릭') },
        { label: '로그아웃', onClick: () => console.log('로그아웃 클릭') },
      ],
    };

    const { baseElement } = render(<Header {...meta} />);
    expect(baseElement).toBeTruthy();
  });
});
