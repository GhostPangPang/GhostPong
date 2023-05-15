import styled from 'styled-components';
import { ModalPortal } from './ModalPortal';
import { Box } from '../Box';
import { ReactComponent as CloseSvg } from '@/svgs/close.svg';
import { IconButton } from '../Button/IconButton';

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <ModalPortal>
      <ModalOverlay>
        <Box position="relative" backgroundColor="gray300" padding="sm" maxHeight="80%" minWidth="80rem">
          <IconButton onClick={onClose} style={{ position: 'absolute', right: '0.5rem' }}>
            <CloseSvg />
          </IconButton>
          {children}
        </Box>
      </ModalOverlay>
    </ModalPortal>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;
