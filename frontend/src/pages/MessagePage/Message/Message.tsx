import { Box } from '@/common';
import { MessageContent } from './MessageContent';
import { MessageInput } from './MessageInput';
import { Suspense } from 'react';

export const Message = () => {
  return (
    <>
      <Box display="flex" direction="column" height="100%" backgroundColor="surfaceMix" overflowY="hidden">
        <Suspense fallback={<></>}>
          <MessageContent />
        </Suspense>
      </Box>
      <MessageInput />
    </>
  );
};
