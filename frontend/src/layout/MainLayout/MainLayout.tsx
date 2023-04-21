import { Outlet } from 'react-router-dom';
import { Content } from '../Content';
import { Header } from '../Header';

export const MainLayout = () => {
  return (
    <>
      <Header xs={0} />
      <Content alignSelf="stretch" xs={1}>
        <Outlet />
      </Content>
    </>
  );
};
