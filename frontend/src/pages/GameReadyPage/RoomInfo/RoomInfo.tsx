import { Grid, Text } from '@/common';
import { ReactComponent as Lock } from '@/svgs/lock.svg';

interface RoomInfoProps {
  name: string;
}

export const RoomInfo = ({ name }: RoomInfoProps) => {
  return (
    <Grid
      container="flex"
      direction="row"
      alignItems="start"
      justifyContent="end"
      size={{ height: '100%', padding: 'md' }}
    >
      <Text>{name}</Text>
      <Lock />
    </Grid>
  );
};
