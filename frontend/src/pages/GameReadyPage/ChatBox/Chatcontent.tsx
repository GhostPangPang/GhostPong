import { useEffect, useRef } from 'react';
import { Box } from '@/common';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { newChannelDataState } from '@/stores';

interface ChatContentProps {
  inputFocus: boolean;
}

const ChatBubble = styled.div`
  background-color: ${(props) => props.theme.color.gray100};
  padding: 0.5rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
`;

export const ChatContent = ({ inputFocus }: ChatContentProps) => {
  const { chats } = useRecoilValue(newChannelDataState);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatElement = chatRef.current;
    if (chatElement) {
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  }, [chats]);

  return (
    <Box
      ref={chatRef}
      display="flex"
      direction="column-reverse"
      height={inputFocus ? '20rem' : '5rem'}
      backgroundColor="surfaceMix"
      overflowY="auto"
    >
      {[...chats].reverse().map((message, index) => (
        <ChatBubble key={index}>
          {message.senderId}: {message.content}
          {/* sender Id -> nickname으로 바꿔야함 어디서 찾을지 벡엔드와 협의중 */}
        </ChatBubble>
      ))}
    </Box>
  );
};
