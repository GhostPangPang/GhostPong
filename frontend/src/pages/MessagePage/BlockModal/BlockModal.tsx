import { Avatar, Box, CommonButton, GameButton, GameInput, Grid, Text, Modal, ModalProps } from '@/common';
import { useInput, useBlocked, useBlockedMutation } from '@/hooks';
import { User } from '@/types/entity';
import { useEffect } from 'react';

const BlockFriendItem = ({ blocked }: { blocked: User }) => {
  const { id, nickname, image } = blocked;
  const { deleteBlocked } = useBlockedMutation();

  return (
    <Box as="li" display="flex" justifyContent="space-between" alignItems="center" padding="sm" width="100%" gap={0.5}>
      <Grid container="flex" flexGrow={1} gap={0.5}>
        <Avatar size="sm" src={image} />
        <Text size="sm" weight="black">
          {nickname}
        </Text>
      </Grid>
      <Grid container="flex" justifyContent="end" flexGrow={0} gap={0.5}>
        <CommonButton size="sm" onClick={() => deleteBlocked(id)}>
          차단해제
        </CommonButton>
      </Grid>
    </Box>
  );
};

export const BlockModal = ({ isOpen, onClose }: Omit<ModalProps, 'children'>) => {
  const { blocked, refetchBlocked } = useBlocked({ enabled: isOpen });
  const { updateBlocked } = useBlockedMutation();
  const { value: nickname, onChange: handleNicknameChange } = useInput('');

  useEffect(() => {
    refetchBlocked();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Grid as="section" gap={1} container="flex" direction="column" flexGrow={0} size={{ paddingLR: 3, paddingTB: 1 }}>
        <Text as="h3" size="sm" weight="black">
          차단하기
        </Text>
        <Grid container="flex" gap={0.5}>
          <GameInput
            value={nickname}
            onChange={handleNicknameChange}
            sizes="sm"
            color="secondary"
            placeholder="플레이어 닉네임"
            style={{ flexGrow: 1 }}
          />
          <GameButton size="sm" style={{ flexGrow: 0 }} onClick={() => updateBlocked(nickname)}>
            차단하기
          </GameButton>
        </Grid>
      </Grid>
      <Grid
        as="section"
        container="flex"
        direction="column"
        gap={1}
        flexGrow={1}
        size={{ paddingLR: 3, paddingTB: 1, minHeight: '0' }}
      >
        <Text as="h3" size="sm" weight="black">
          차단친구목록
        </Text>
        <Grid as="ul" container="flex" direction="column" gap={0.5} size={{ overflowY: 'auto', height: '100%' }}>
          {blocked.map((blocked) => (
            <BlockFriendItem key={blocked.id} blocked={blocked} />
          ))}
        </Grid>
      </Grid>
    </Modal>
  );
};
