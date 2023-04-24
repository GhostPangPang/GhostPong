import { ReactComponent as Logo } from '@/svgs/logo-sm.svg';
import { Grid } from '../Grid';
import { Avatar } from '@/common/Avatar';
import { Dropbox, DropboxProps } from '@/common/Dropbox';
import { Text } from '@/common/Text';
import { RankProgressBar } from '@/common/RankProgressBar';

interface HeaderProps {
  nickname: string;
  image: string;
  exp: number;
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
