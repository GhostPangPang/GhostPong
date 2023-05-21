import { Text } from '@/common';
import styled from 'styled-components';

interface GameDropdownProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const GameDropdownSelect = styled.select`
  border-radius: 0.4rem;
  background-color: ${({ theme }) => theme.color.gray100};
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  cursor: pointer;
`;

export const GameDropdown = ({ onChange }: GameDropdownProps) => {
  return (
    <GameDropdownSelect onChange={onChange}>
      <Text as="option">public</Text>
      <Text as="option">protected</Text>
      <Text as="option">private</Text>
    </GameDropdownSelect>
  );
};

export default GameDropdown;
