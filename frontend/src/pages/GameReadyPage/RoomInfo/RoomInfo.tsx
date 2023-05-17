import { Grid, Text } from '@/common';
import { ReactComponent as Lock } from '@/svgs/lock.svg';

interface RoomInfoProps {
  id: number;
  name: string;
}

export const RoomInfo = ({ id, name }: RoomInfoProps) => {
  return (
    <Grid
      container="flex"
      direction="row"
      alignItems="start"
      justifyContent="end"
      size={{ height: '100%', padding: 'md' }}
    >
      <Text id={id}>{name}</Text>
      <Lock />
    </Grid>
  );
};
