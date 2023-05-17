import styled from 'styled-components';
import { ReactComponent as SendSvg } from '@/svgs/send.svg';
import { Box } from '@/common/Box';
import { IconButton } from '@/common/Button';

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

interface MessageInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onClick: () => void;
}

export const MessageInput = ({ value, onChange, onClick }: MessageInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onClick();
  };

  return (
    <Box display="flex" flexGrow={0} height="3rem" alignItems="center" style={{ padding: '1.8rem 1rem' }}>
      <StyledInput
        type="text"
        placeholder="메시지를 입력하세요."
        style={{ flexGrow: 1 }}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <SendButton onClick={onClick} />
    </Box>
  );
};
