import { Grid, Text, IconButton } from '@/common';
import { ReactComponent as Lock } from '@/svgs/lock.svg';
import { ReactComponent as Out } from '@/svgs/out.svg';

interface RoomInfoProps {
  name: string;
}

export const RoomInfo = ({ name }: RoomInfoProps) => {
  return (
    <Grid
      container="flex"
      direction="row"
      alignItems="start"
      justifyContent="space-between"
      size={{ height: '100%', padding: 'md' }}
    >
      <IconButton>
        <Out />
      </IconButton>
      <Grid container="flex" direction="row" alignItems="center" justifyContent="end">
        <Lock />
        <Text size="lg">{name}</Text>
      </Grid>
    </Grid>
  );
};
