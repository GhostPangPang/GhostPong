import { Avatar } from '@/common/Avatar';
import { Box } from '@/common/Box';
import { Grid } from '@/common/Grid';
import { Text } from '@/common/Text';
import { Fragment } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useMessages } from '@/hooks/useMessages';
import { useIntersectObserver } from '@/hooks/useIntersectObserver';
import { Message } from '@/types/entity';
import { formatTime } from '@/libs/utils';
import { useMessagesEvent } from '@/hooks/useMessagesEvent';
import { nanoid } from 'nanoid';

interface MessageContentItemProps {
  side: 'right' | 'left';
  content: Message['content'];
  createdAt?: Message['createdAt'];
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
      <Text size="xxxs" weight="light" color="gray100" style={{ order: side === 'right' ? 0 : -2 }}>
        {formatTime(createdAt)}
      </Text>
    </Grid>
  );
};

export const MessageContent = () => {
  const { userInfo } = useUserInfo();
  const { currentId, receivedMessageList, sendMessageList } = useMessagesEvent();
  const {
    data: { pages },
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useMessages(currentId);
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
                createdAt={item.createdAt}
              />
            );
          })}
          {receivedMessageList.map((data) => (
            <MessageContentItem key={nanoid()} side={'left'} content={data.content} createdAt={new Date()} />
          ))}
          {sendMessageList.map((data) => (
            <MessageContentItem key={nanoid()} side={'right'} content={data.content} createdAt={new Date()} />
          ))}
        </Fragment>
      ))}
    </Grid>
  );
};
