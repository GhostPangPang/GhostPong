import styled from 'styled-components';
import { ReactComponent as Logo } from '@imgs/logo-sm.svg';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;

  width: 100%;
  height: 9.6rem;
`;

export const Header: React.FC = () => {
  return (
    <StyledHeader>
      <Logo />
    </StyledHeader>
  );
};
