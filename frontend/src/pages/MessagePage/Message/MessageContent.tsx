import { Avatar } from '@/common/Avatar';
import { Box } from '@/common/Box';
import { Grid } from '@/layout/Grid';
import { Text } from '@/common/Text';
import { Fragment } from 'react';
import { useUserInfo } from '@/stores/userInfo';
import { useMessages } from '@/hooks/useMessages';
import { useIntersectObserver } from '@/hooks/useIntersectObserver';

interface MessageContentItemProps {
  side: 'right' | 'left';
  content: string;
  createdAt?: string;
}

export const MessageContentItem = ({ side, content, createdAt = '' }: MessageContentItemProps) => {
  return (
    <Grid container="flex" justifyContent={side === 'right' ? 'start' : 'end'} alignItems="end" gap={0.8} flexGrow={1}>
      <Avatar size="sm" src="https://loremflickr.com/640/480" />
      <Box backgroundColor="surface" padding="sm" maxWidth="80%" style={{ order: side === 'right' ? 0 : -1 }}>
        <Text size="xxs" weight="light">
          {content}
        </Text>
      </Box>
      <Text size="xxs" weight="light" color="gray200" style={{ order: side === 'right' ? 0 : -2 }}>
        {createdAt}
      </Text>
    </Grid>
  );
};

export const MessageContent = ({ friendId }: { friendId: number }) => {
  const { userInfo } = useUserInfo();
  const {
    data: { pages },
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useMessages(friendId);
  const messageRef = useIntersectObserver(
    async (entry, observer) => {
      console.log('Intersect');
      observer.unobserve(entry.target);
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    { rootMargin: '0px 0px 100px 0px' },
  );

  return (
    <Grid container="flex" direction="column" rowGap={2} size={{ padding: 'sm' }}>
      <Text ref={messageRef} size="xxs" color="gray100" style={{ alignSelf: 'center', paddingBottom: '5rem' }}>
        ──────────── 마지막 메세지 입니다 ────────────
      </Text>
      {pages.map((group, i) => (
        <Fragment key={i}>
          {group.messages.map((item) => {
            return (
              <MessageContentItem
                key={item.id}
                side={item.senderId == userInfo.id ? 'right' : 'left'}
                content={item.content}
              />
            );
          })}
        </Fragment>
      ))}
    </Grid>
  );
};
