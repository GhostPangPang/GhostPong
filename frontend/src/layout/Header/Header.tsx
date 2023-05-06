import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';
import { Grid } from '../Grid';
import { Avatar, AvatarProps } from '@/common/Avatar';
import { Dropbox, DropboxProps } from '@/common/Dropbox';
import { Text } from '@/common/Text';
import { RankProgressBar, RankProgressBarProps } from '@/common/RankProgressBar';
import { Link } from 'react-router-dom';

interface HeaderProps {
  nickname: string;
  exp: RankProgressBarProps['exp'];
  image: AvatarProps['src'] | null;
  items: DropboxProps['items'];
}

export const Header = ({ nickname, image, exp, items }: HeaderProps) => {
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
        <Link to="/">
          <Logo />
        </Link>
        <RankProgressBar exp={exp} />
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="center" gap={1.5} xs={3}>
        <Text size="sm">{nickname}</Text>
        <Dropbox items={items} placement="bottomright">
          <Avatar size="sm" src={image ?? undefined} />
        </Dropbox>
      </Grid>
    </Grid>
  );
};
