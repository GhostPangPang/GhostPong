import { Outlet } from 'react-router-dom';
import { Content } from '../Content';
import { Header } from '../Header';

export const MainLayout = () => {
  const meta = {
    nickname: 'Test',
    image: 'https://avatars.githubusercontent.com/u/48207131?v=4',
    exp: 100,
  };

  return (
    <>
      <Header {...meta} />
      <Content alignSelf="stretch">
        <Outlet />
      </Content>
    </>
  );
};
