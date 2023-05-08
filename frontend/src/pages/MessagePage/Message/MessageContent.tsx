import { Avatar } from '@/common/Avatar';
import { Box } from '@/common/Box';
import { Grid } from '@/layout/Grid';
import { Text } from '@/common/Text';

interface MessageContentProps {
  side: 'right' | 'left';
  content: string;
  createdAt?: string | undefined;
}

export const MessageContent = ({ side, content }: MessageContentProps) => {
  return (
    <Grid container="flex" justifyContent={side === 'right' ? 'start' : 'end'} alignItems="end" gap={0.8} flexGrow={1}>
      <Avatar size="sm" src="https://loremflickr.com/640/480" />
      <Box backgroundColor="surface" padding="sm" maxWidth="80%" style={{ order: side === 'right' ? 0 : -1 }}>
        <Text size="xxs" weight="light">
          {content}
        </Text>
      </Box>
      {/* <Text size="xxs" weight="light" color="gray200" style={{ order: side === 'right' ? 0 : -2 }}>
        {createdAt}
      </Text> */}
    </Grid>
  );
};
