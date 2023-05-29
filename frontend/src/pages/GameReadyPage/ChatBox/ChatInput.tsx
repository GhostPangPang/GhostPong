import styled from 'styled-components';
import { IconButton, Box } from '@/common';
import { ReactComponent as SendSvg } from '@/svgs/send.svg';
import { useInput } from '@/hooks';
import { useState } from 'react';
import { useChat } from '@/hooks/channel/useChat';

interface ChatInputProps {
  onFocus?: () => void;
  onBlur?: () => void;
}

const StyledInput = styled.input`
  font-size: 1.2rem;
  font-weight: 300;
  text-decoration: none;
  overflow-x: hidden;
  color: ${(props) => props.theme.color.gray100};
`;

const SendButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <IconButton onClick={onClick}>
      <SendSvg width="1.2rem" height="1.2rem" stroke="#D4D4D4" style={{ flexGrow: 0 }} />
    </IconButton>
  );
};

export const ChatInput = ({ onFocus, onBlur }: ChatInputProps) => {
  const [isComposing, setIsComposing] = useState(false);
  const { value: content, setValue: setContent, onChange: handleContentChange } = useInput('');
  const { sendChat } = useChat();

  const handleSend = () => {
    if (content) {
      sendChat(content);
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
        size={512}
        maxLength={512}
        style={{ flexGrow: 1 }}
        value={content}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <SendButton onClick={handleSend} />
    </Box>
  );
};
