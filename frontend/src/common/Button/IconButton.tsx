import { darken } from 'polished';
import styled from 'styled-components';

export const IconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0.5rem;

  border-radius: ${(props) => props.theme.borderRadius.sm};
  &:hover {
    background-color: ${(props) => darken(0.5, props.theme.color.surface)};
  }
`;
