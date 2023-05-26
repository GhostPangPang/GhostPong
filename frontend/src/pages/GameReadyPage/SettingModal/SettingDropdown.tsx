import { Text } from '@/common';
import styled from 'styled-components';

interface SettingDropdownProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SettingDropdownSelect = styled.select`
  border-radius: 0.4rem;
  background-color: ${({ theme }) => theme.color.gray100};
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  cursor: pointer;
`;

export const SettingDropdown = ({ onChange }: SettingDropdownProps) => {
  return (
    <SettingDropdownSelect onChange={onChange}>
      <Text as="option">public</Text>
      <Text as="option">protected</Text>
      <Text as="option">private</Text>
    </SettingDropdownSelect>
  );
};

export default SettingDropdown;
