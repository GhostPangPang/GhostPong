import { render } from '@/test';
import { Dropbox } from './Dropbox';
import { Avatar } from '../Avatar';

const items = [
  { label: '프로필', onClick: () => console.log('프로필 클릭') },
  { label: '메세지', onClick: () => console.log('메세지 클릭') },
  { label: '내 정보 수정', onClick: () => console.log('내 정보 수정 클릭') },
  { label: '로그아웃', onClick: () => console.log('로그아웃 클릭') },
];

describe('Avatar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Dropbox items={items} placement="bottomright">
        <Avatar
          src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
          alt="default_name"
          size="md"
        />
        <div>some div</div>{' '}
      </Dropbox>,
    );
    expect(baseElement).toBeTruthy();
  });
});
