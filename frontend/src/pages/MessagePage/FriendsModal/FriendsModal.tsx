import { Avatar, Box, CommonButton, GameButton, GameInput, Grid, Text } from '@/common';
import { Modal, ModalProps } from '@/common/Modal/Modal';
import { useFriendMutate } from '@/hooks/useFriendMutate';
import { useFriendRequest } from '@/hooks/useFriendRequest';
import { useInput } from '@/hooks/useInput';
import { ApiError } from '@/libs/api';
import { User } from '@/types/entity';

const FriendRequestItem = ({ friendId, friend }: { friendId: number; friend: User }) => {
  const { nickname, image } = friend;
  const { acceptMutation, rejectMutation } = useFriendMutate();

  const handleAccept = async () => {
    if (!friendId) return;
    try {
      await acceptMutation.mutateAsync(friendId);
    } catch (error) {
      const { message } = error as ApiError;
      alert(message);
    }
  };

  const handleReject = async () => {
    if (!friendId) return;
    try {
      await rejectMutation.mutateAsync(friendId);
    } catch (error) {
      const { message } = error as ApiError;
      alert(message);
    }
  };

  return (
    <Box as="li" display="flex" justifyContent="space-between" alignItems="center" padding="sm" width="100%" gap={0.5}>
      <Grid container="flex" flexGrow={1} gap={0.5}>
        <Avatar size="sm" src={image} />
        <Text size="sm" weight="black">
          {nickname}
        </Text>
      </Grid>
      <Grid container="flex" justifyContent="end" flexGrow={0} gap={0.5}>
        <CommonButton size="sm" onClick={handleAccept}>
          수락
        </CommonButton>
        <CommonButton size="sm" onClick={handleReject}>
          거절
        </CommonButton>
      </Grid>
    </Box>
  );
};

export const FriendsModal = ({ isOpen, onClose }: Omit<ModalProps, 'children'>) => {
  const {
    data: { requests },
  } = useFriendRequest();
  const { value: nickname, onChange: handleNicknameChange } = useInput('');
  const { requestMutation } = useFriendMutate();

  const handleFriendRequest = async () => {
    if (!nickname) return;
    try {
      await requestMutation.mutateAsync(nickname);
    } catch (error) {
      const { message } = error as ApiError;
      alert(message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Grid as="section" gap={1} container="flex" direction="column" flexGrow={0} size={{ paddingLR: 3, paddingTB: 1 }}>
        <Text as="h3" size="sm" weight="black">
          친구추가
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
          <GameButton size="sm" style={{ flexGrow: 0 }} onClick={handleFriendRequest}>
            친구추가
          </GameButton>
        </Grid>
      </Grid>
      <Grid
        as="section"
        gap={1}
        container="flex"
        direction="column"
        flexGrow={1}
        size={{ paddingLR: 3, paddingTB: 1, minHeight: '0' }}
      >
        <Text as="h3" size="sm" weight="black">
          친구신청목록
        </Text>
        <Grid as="ul" container="flex" direction="column" gap={0.5} size={{ overflowY: 'auto', height: '100%' }}>
          {requests.map((request) => (
            <FriendRequestItem key={request.id} friendId={request.id} friend={request.sender} />
          ))}
        </Grid>
      </Grid>
    </Modal>
  );
};
