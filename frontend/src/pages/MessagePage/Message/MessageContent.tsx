import { Avatar, Box, Grid, Text } from '@/common';
import { Fragment, useEffect, useRef } from 'react';
import { useUserInfo } from '@/hooks/user';
import { useMessages, useNewMessages } from '@/hooks/message';
import { useIntersectObserver } from '@/hooks/useIntersectObserver';
import { Message, User } from '@/types/entity';
import { formatTime } from '@/libs/utils';
import { nanoid } from 'nanoid';

interface MessageContentItemProps {
  side: 'right' | 'left';
  user: User;
  content: Message['content'];
  createdAt?: Message['createdAt'];
}

export const MessageContentItem = ({ side, user, content, createdAt = '' }: MessageContentItemProps) => {
  return (
    <Grid container="flex" justifyContent={side === 'right' ? 'start' : 'end'} alignItems="end" gap={0.8} flexGrow={1}>
      <Avatar size="sm" src={user.image} />
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
  const { currentFriend, newMessages } = useNewMessages();
  const {
    messages: { pages },
    hasMoreMessages,
    isFetching,
    fetchNextMessages,
  } = useMessages();
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const messageRef = useIntersectObserver(
    async (entry, observer) => {
      observer.unobserve(entry.target);
      if (hasMoreMessages && !isFetching) {
        fetchNextMessages();
      }
    },
    { rootMargin: '0px 0px 100px 0px' },
  );

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [newMessages]);

  return (
    <Grid
      ref={messageBoxRef}
      container="flex"
      direction="column-reverse"
      rowGap={2}
      size={{ padding: 'sm', overflowY: 'auto' }}
    >
      {currentFriend &&
        newMessages.map((data) => (
          <MessageContentItem
            key={nanoid()}
            side={data.receiverId == userInfo.id ? 'right' : 'left'}
            user={data.receiverId == userInfo.id ? userInfo : currentFriend.user}
            content={data.content}
            createdAt={new Date()}
          />
        ))}
      {currentFriend &&
        pages.map((group, i) => (
          <Fragment key={i}>
            {group.map((item) => {
              return (
                <MessageContentItem
                  key={nanoid()}
                  side={item.senderId === userInfo.id ? 'left' : 'right'}
                  user={item.senderId == userInfo.id ? currentFriend.user : userInfo}
                  content={item.content}
                  createdAt={item.createdAt}
                />
              );
            })}
          </Fragment>
        ))}
      <Text ref={messageRef} size="xxs" color="gray100" style={{ alignSelf: 'center', paddingBottom: '5rem' }}>
        ──────────── 마지막 메세지 입니다 ────────────
      </Text>
    </Grid>
  );
};
