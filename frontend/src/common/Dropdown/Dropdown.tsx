import styled from 'styled-components';

export interface DropdownProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

const DropdownSelect = styled.select`
  border-radius: 0.4rem;
  background-color: ${({ theme }) => theme.color.gray100};
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  cursor: pointer;
`;

export const Dropdown = ({ onChange, children }: DropdownProps) => {
  return <DropdownSelect onChange={onChange}>{children}</DropdownSelect>;
};

export default Dropdown;
