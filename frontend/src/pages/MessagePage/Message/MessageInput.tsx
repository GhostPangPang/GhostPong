import styled from 'styled-components';
import { ReactComponent as SendSvg } from '@/svgs/send.svg';
import { Box, IconButton } from '@/common';
import { useInput } from '@/hooks';
import { useNewMessages } from '@/hooks/message/useNewMessages';
import { useState } from 'react';

const StyledInput = styled.input`
  font-size: 1.2rem;
  font-weight: 300;
  text-decoration: none;
  color: ${(props) => props.theme.color.gray100};
`;

const SendButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <IconButton onClick={onClick}>
      <SendSvg width="1.2rem" height="1.2rem" stroke="#D4D4D4" style={{ flexGrow: 0 }} />
    </IconButton>
  );
};

export const MessageInput = () => {
  const { sendMessage } = useNewMessages();
  const [isComposing, setIsComposing] = useState(false);
  const { value: content, setValue: setContent, onChange: handleContentChange } = useInput('');

  const handleSend = () => {
    if (content) {
      sendMessage(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;
    if (e.key === 'Enter') handleSend();
  };

  return (
    <Box display="flex" flexGrow={0} height="3rem" alignItems="center" style={{ padding: '1.8rem 1rem' }}>
      <StyledInput
        type="text"
        placeholder="메시지를 입력하세요."
        style={{ flexGrow: 1 }}
        value={content}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
      />
      <SendButton onClick={handleSend} />
    </Box>
  );
};
