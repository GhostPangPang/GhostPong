import { ScrollableContent } from './ScrollableContent';
import { ScrollableHeader } from './ScrollableHeader';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer';

export const ScollableLayout = () => {
  const { userInfo } = useAuth();

  const items = [
    { label: '프로필', onClick: () => console.log('프로필 클릭') },
    { label: '메세지', onClick: () => console.log('메세지 클릭') },
    { label: '내 정보 수정', onClick: () => console.log('내 정보 수정 클릭') },
    { label: '로그아웃', onClick: () => console.log('로그아웃 클릭') },
  ];

  useEffect(() => {
    console.log('UserInfo changed!', userInfo);
  }, [userInfo]);

  return (
    <>
      <ScrollableHeader nickname={userInfo.nickname} image={userInfo.image} exp={userInfo.exp} items={items} />
      <ScrollableContent alignSelf="stretch">
        <Outlet />
      </ScrollableContent>
      <Footer />
    </>
  );
};
