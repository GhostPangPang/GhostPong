import { darken } from 'polished';
import styled from 'styled-components';
import { ReactComponent as SendSvg } from '@/svgs/send.svg';
import { Box } from '@/common/Box';

const StyledInputButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0.5rem;

  border-radius: ${(props) => props.theme.borderRadius.sm};
  &:hover {
    background-color: ${(props) => darken(0.5, props.theme.color.surface)};
  }
`;

const StyledInput = styled.input`
  font-size: 1.2rem;
  font-weight: 300;
  text-decoration: none;
  color: ${(props) => props.theme.color.gray100};
`;

const SendButton = () => {
  return (
    <StyledInputButton>
      <SendSvg width="1.2rem" height="1.2rem" stroke="#D4D4D4" style={{ flexGrow: 0 }} />
    </StyledInputButton>
  );
};

export const MessageInput = () => {
  return (
    <Box display="flex" flexGrow={0} height="3rem" alignItems="center" style={{ padding: '1.8rem 1rem' }}>
      <StyledInput type="text" placeholder="메시지를 입력하세요." style={{ flexGrow: 1 }} />
      <SendButton />
    </Box>
  );
};
