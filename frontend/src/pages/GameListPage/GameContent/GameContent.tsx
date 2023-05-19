import { Grid, Text, Box, Modal, InputBox, GameButton } from '@/common';
import styled from 'styled-components';
import image1 from '@/assets/svgs/ChannelBackground1.png';
import image2 from '@/assets/svgs/ChannelBackground2.png';
import { ReactComponent as LockIcon } from '@/svgs/lock.svg';
import { ReactComponent as PeopleIcon } from '@/svgs/people.svg';
import { ChannelsListResponse, ChannelInfo } from '@/dto/channel/response';
import { useJoinChannelMutation } from '@/hooks/useChannelMutate';
import { useInput } from '@/hooks/useInput';
import { validatePassword } from '@/libs/utils/validate';
import { useState } from 'react';

interface GameContentProps {
  channels: ChannelsListResponse['channels'];
}

interface GameItemProps extends ChannelInfo {
  backgroundImageUrl: string;
}

const StyledGameListItem = styled.article<{ backgroundImageUrl: string }>`
  height: 12.3rem;
  width: 37.2rem;
  background-image: url(${(props) => props.backgroundImageUrl});
  background-size: contain;
  border-radius: 1rem;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: rgba(256, 256, 256, 0.1);
  }
  &:active {
    background-color: rgba(0, 0, 0, 1);
  }
`;

interface PasswordModalProps {
  password: string | undefined;
  errorMessage: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: React.MouseEventHandler<HTMLButtonElement>;
}

const PasswordModal = ({ password, errorMessage, onChange, handleSubmit }: PasswordModalProps) => {
  return (
    <Grid
      container="flex"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      size={{ padding: 'lg' }}
    >
      <Text size="xl" weight="bold" color="gray100">
        Enter Password
      </Text>
      <Text size="xs" color="warning">
        {errorMessage}
      </Text>
      <InputBox sizes="md" type="password" value={password} onChange={onChange} />
      <GameButton size="md" color="primary" onClick={handleSubmit}>
        JOIN
      </GameButton>
    </Grid>
  );
};

const GameListItem = ({ id, name, mode, count, backgroundImageUrl }: GameItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { value: password, onChange, errorMessage } = useInput({ initialValue: '', validationFunc: validatePassword });

  const { handleSubmit } = useJoinChannelMutation({ mode, password, id });
  return (
    <>
      <StyledGameListItem
        backgroundImageUrl={backgroundImageUrl}
        onClick={mode === 'protected' ? () => setIsOpen(true) : handleSubmit}
      >
        <Box backgroundColor="foregroundt" padding={0.5} width="100%">
          <Grid container="flex" justifyContent="space-between" alignItems="center">
            <Text size="xs" color="gray200" weight="bold" style={{ marginLeft: '0.5rem' }}>
              {name}
            </Text>
            {['protected', 'private'].includes(mode) && <LockIcon />}
          </Grid>
        </Box>
        <Grid
          container="flex"
          direction="row"
          alignItems="center"
          style={{ position: 'absolute', bottom: '0', left: '0', marginLeft: '0.5rem' }}
        >
          <PeopleIcon />
          <Text size="xs">{count.toString() + '/10'}</Text>
        </Grid>
      </StyledGameListItem>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PasswordModal
          password={password}
          errorMessage={errorMessage}
          onChange={onChange}
          handleSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
};

export const GameContent = ({ channels }: GameContentProps) => {
  return (
    <>
      {channels.map((channel, index) => {
        return (
          <GameListItem
            key={index}
            backgroundImageUrl={index % 2 !== 0 ? image1 : image2}
            id={channel.id}
            name={channel.name}
            mode={channel.mode}
            count={channel.count}
          />
        );
      })}
    </>
  );
};
