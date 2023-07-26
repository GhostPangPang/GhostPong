import { Box } from '@/common';
import { MessageContent } from './MessageContent';
import { MessageInput } from './MessageInput';
import { Suspense } from 'react';
import { useNewMessages } from '@/hooks';

export const Message = () => {
  const { currentFriend } = useNewMessages();

  if (!currentFriend) {
    return (
      <Box display="flex" backgroundColor="surfaceMix" justifyContent="center" alignItems="center" height="100%">
        <img src="/svg/sm-ghost.svg" alt="empty" width="32px" />
      </Box>
    );
  }
  return (
    <>
      <Box
        display="flex"
        direction="column"
        justifyContent="end"
        height="100%"
        backgroundColor="surfaceMix"
        overflowY="hidden"
      >
        <Suspense fallback={<></>}>
          <MessageContent />
        </Suspense>
      </Box>
      <MessageInput />
    </>
  );
};
