import { Box } from '@/common/Box';
import { MessageContent } from './MessageContent';
import { MessageInput } from './MessageInput';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useMessagesEvent } from '@/hooks/useMessagesEvent';

export const Message = () => {
  const { currentId: friendId, sendMessage } = useMessagesEvent();
  const [content, setContent] = useState<string>('');
  const messageBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [friendId]);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleSend = () => {
    if (content) sendMessage(content);
  };

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
          <MessageContent />
        </Suspense>
      </Box>
      <MessageInput value={content} onChange={handleContentChange} onClick={handleSend} />
    </>
  );
};
