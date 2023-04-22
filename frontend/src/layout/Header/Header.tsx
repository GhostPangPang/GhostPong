import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';
import { Grid, GridItemProps } from '../Grid';
import { Avatar } from '@/common/Avatar';
import { Dropbox } from '@/common/Dropbox';

export const Header = (props: GridItemProps) => {
  const items = [
    { label: '프로필', onClick: () => console.log('프로필 클릭') },
    { label: '메세지', onClick: () => console.log('메세지 클릭') },
    { label: '내 정보 수정', onClick: () => console.log('내 정보 수정 클릭') },
    { label: '로그아웃', onClick: () => console.log('로그아웃 클릭') },
  ];

  return (
    <Grid
      as="header"
      container="flex"
      justifyContent="space-between"
      alignItems="center"
      size={{ padding: 'header' }}
      {...props}
    >
      <Logo />
      <Grid container="flex" justifyContent="end" alignItems="center" gap={1}>
        nickname
        <Dropbox items={items} placement="bottomleft">
          <Avatar size="sm" />
        </Dropbox>
      </Grid>
    </Grid>
  );
};
