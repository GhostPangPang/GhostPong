import { Content } from '../Content';
import { Header } from '../Header';
import { Suspense, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
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
      <Header
        nickname={userInfo.nickname}
        image={userInfo.image}
        exp={userInfo.exp}
        items={items}
        height="10rem"
        padding="header"
        flexGrow={0}
      />
      <Content
        direction="column"
        alignSelf="stretch"
        justifyContent="center"
        alignItems="center"
        padding="content"
        height="calc(100% - 10rem)"
      >
        <Suspense fallback={<h1>Loading</h1>}>
          <Outlet />
        </Suspense>
      </Content>
    </>
  );
};
