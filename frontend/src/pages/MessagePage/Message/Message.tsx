import { Box } from '@/common/Box';
import { Text } from '@/common/Text';
import { Grid } from '@/layout/Grid';
import { useUserInfo } from '@/stores/userInfo';
import { MessageResponse } from '@/dto/message/response';
import { MessageContent } from './MessageContent';
import { MessageInput } from './MessageInput';
import { Fragment, forwardRef, useEffect, useRef } from 'react';

interface MessageProps {
  messages: MessageResponse[];
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(({ messages }, ref) => {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

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
        <Grid container="flex" direction="column" justifyContent="end" flexGrow={1} rowGap={2} size={{ padding: 'sm' }}>
          <Text ref={ref} size="xxs" color="gray100" style={{ alignSelf: 'center', paddingBottom: '5rem' }}>
            ──────────── 마지막 메세지 입니다 ────────────
          </Text>
          {messages.map((group, i) => (
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
      </Box>
      <MessageInput />
    </>
  );
});

Message.displayName = 'Message';
