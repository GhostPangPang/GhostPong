import styled from 'styled-components';
import { ReactComponent as Logo } from '@imgs/logo.svg';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;

  width: 100%;
  height: 9.6rem;

  padding: 0 2.4rem;
`;

export const Header: React.FC = () => {
  return (
    <StyledHeader>
      <Logo />
    </StyledHeader>
  );
};
