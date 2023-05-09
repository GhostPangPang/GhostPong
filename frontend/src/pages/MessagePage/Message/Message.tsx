import { Box } from '@/common/Box';
import { Text } from '@/common/Text';
import { Grid } from '@/layout/Grid';
import { useUserInfo } from '@/stores/userInfo';
import { MessageResponse } from '@/dto/message/response';
import { MessageContent } from './MessageContent';
import { MessageInput } from './MessageInput';
import { Fragment, Suspense, forwardRef, useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useIntersect } from '@/hooks/useIntersect';

interface MessageProps {
  friendId: number;
}

export const Message = ({ friendId }: MessageProps) => {
  const { userInfo } = useUserInfo();
  const {
    data: { pages },
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useMessages(friendId);
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const messageRef = useIntersect(
    async (entry, observer) => {
      observer.unobserve(entry.target);
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    { rootMargin: '0px 0px 100px 0px' },
  );

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [pages]);

  return (
    <>
      <Box
        ref={messageBoxRef}
        display="flex"
        direction="column"
        height="100%"
        backgroundColor="surfaceMix"
        gap={1}
        overflowY="auto"
      >
        <Suspense fallback={<></>}>
          <Grid
            container="flex"
            direction="column"
            justifyContent="end"
            flexGrow={1}
            rowGap={2}
            size={{ padding: 'sm' }}
          >
            <Text ref={messageRef} size="xxs" color="gray100" style={{ alignSelf: 'center', paddingBottom: '5rem' }}>
              ──────────── 마지막 메세지 입니다 ────────────
            </Text>
            {pages.map((group, i) => (
              <Fragment key={i}>
                {group.messages.map((item) => {
                  return (
                    <MessageContent
                      side={item.senderId == userInfo.id ? 'right' : 'left'}
                      content={item.content}
                      key={item.id}
                    />
                  );
                })}
              </Fragment>
            ))}
          </Grid>
        </Suspense>
      </Box>
      <MessageInput />
    </>
  );
};

// Message.displayName = 'Message';
