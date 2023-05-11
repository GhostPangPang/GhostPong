import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';
import { LayoutProps, ItemProps, ResponsiveProps } from '@/types/style';
import { Grid } from '@/common/Grid';
import { Avatar, AvatarProps } from '@/common/Avatar';
import { Dropbox, DropboxProps } from '@/common/Dropbox';
import { Text } from '@/common/Text';
import { RankProgressBar, RankProgressBarProps } from '@/common/ProgressBar/RankProgressBar';
import { Link } from 'react-router-dom';

type HeaderProps = {
  nickname: string;
  exp: RankProgressBarProps['exp'];
  image: AvatarProps['src'] | null;
  items: DropboxProps['items'];
} & Pick<LayoutProps, 'padding' | 'height'> &
  Pick<ItemProps, 'flexGrow'> &
  Pick<ResponsiveProps, 'xs'>;

export const Header = ({ nickname, image, exp, items, padding, height, flexGrow, xs }: HeaderProps) => {
  return (
    <Grid
      as="header"
      container="flex"
      justifyContent="space-between"
      alignItems="center"
      size={{ height, padding }}
      flexGrow={flexGrow}
      xs={xs}
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
