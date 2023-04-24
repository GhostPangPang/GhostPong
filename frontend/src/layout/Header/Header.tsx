import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';
import { Grid } from '../Grid';
import { Avatar } from '@/common/Avatar';
import { Dropbox } from '@/common/Dropbox';
import { Text } from '@/common/Text';
import { RankProgressBar } from '@/common/RankProgressBar';

interface HeaderProps {
  nickname: string;
  image: string;
  exp: number;
}

export const Header = ({ nickname, image, exp }: HeaderProps) => {
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
      xs={0}
    >
      <Grid container="flex" justifyContent="start" alignItems="center" xs={2}>
        <Logo />
        <RankProgressBar exp={exp} />
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="center" gap={1.5} xs={3}>
        <Text size="sm">{nickname}</Text>
        <Dropbox items={items} placement="bottomleft">
          <Avatar size="sm" src={image} />
        </Dropbox>
      </Grid>
    </Grid>
  );
};
