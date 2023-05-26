import styled from 'styled-components';
import { ModalPortal } from './ModalPortal';
import { Box } from '../Box';
import { ReactComponent as CloseSvg } from '@/svgs/close.svg';
import { IconButton } from '../Button/IconButton';

export type ModalComponent = ({ children, isOpen, onClose, style }: ModalProps) => JSX.Element | null;

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  style?: React.CSSProperties;
}

export const Modal: ModalComponent = ({ children, isOpen, onClose, style }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <ModalPortal>
      <ModalOverlay>
        <Box
          display="flex"
          direction="column"
          position="relative"
          backgroundColor="gray300"
          padding="sm"
          height="80%"
          style={style}
        >
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
