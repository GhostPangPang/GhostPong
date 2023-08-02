import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';
import { ResponsiveProps } from '@/types/style';
import { Grid, Avatar, Dropbox, Text, RankProgressBar } from '@/common';
import { Link, useNavigate } from 'react-router-dom';
import { removeAccessToken } from '@/libs/api/auth';
import { useAuth } from '@/hooks';

type HeaderProps = Pick<ResponsiveProps, 'xs' | 'md' | 'lg'>;

export const Header = ({ xs, md, lg }: HeaderProps) => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const { id, nickname, exp, image } = userInfo;

  const items = [
    { label: '프로필', onClick: () => navigate(`/profile/${id}`) },
    { label: '메세지', onClick: () => navigate('/message') },
    { label: '내 정보 수정', onClick: () => navigate('/profile/edit') },
    {
      label: '로그아웃',
      onClick: () => {
        removeAccessToken();
        navigate('/pre');
      },
    },
  ];

  return (
    <Grid
      as="header"
      container="flex"
      justifyContent="space-between"
      alignItems="center"
      size={{ height: '10rem', padding: 'header' }}
      flexGrow={0}
      xs={xs}
      md={md}
      lg={lg}
    >
      <Grid container="flex" justifyContent="start" alignItems="center" xs={2}>
        <Link to="/">
          <Logo />
        </Link>
        <RankProgressBar exp={exp} />
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="center" gap={1.5} xs={3}>
        <Text size="sm">{nickname}</Text>
        <Dropbox items={items} placement="bottomright">
          <Avatar size="sm" src={image} />
        </Dropbox>
      </Grid>
    </Grid>
  );
};
