import { Box } from '@/common/Box';
import { MessageContent } from './MessageContent';
import { MessageInput } from './MessageInput';
import { Fragment, Suspense, useEffect, useRef } from 'react';

interface MessageProps {
  friendId: number;
}

export const Message = ({ friendId }: MessageProps) => {
  const messageBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [friendId]);

  return (
    <>
      <Box
        ref={messageBoxRef}
        display="flex"
        direction="column-reverse"
        height="100%"
        backgroundColor="surfaceMix"
        overflowY="auto"
        style={{ direction: 'ltr' }}
      >
        <Suspense fallback={<></>}>
          <MessageContent friendId={friendId} />
        </Suspense>
      </Box>
      <MessageInput />
    </>
  );
};
