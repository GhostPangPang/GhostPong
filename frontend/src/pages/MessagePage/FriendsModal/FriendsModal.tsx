import { Avatar, Box, CommonButton, GameButton, GameInput, Grid, Text, Modal, ModalProps } from '@/common';
import { useInput, useFriendMutation, useFriendRequest } from '@/hooks';
import { User } from '@/types/entity';
import { useEffect } from 'react';

const FriendRequestItem = ({ friendId, friend }: { friendId: number; friend: User }) => {
  const { nickname, image } = friend;
  const { acceptFriendRequest, rejectFriendRequest } = useFriendMutation();

  return (
    <Box as="li" display="flex" justifyContent="space-between" alignItems="center" padding="sm" width="100%" gap={0.5}>
      <Grid container="flex" flexGrow={1} gap={0.5}>
        <Avatar size="sm" src={image} />
        <Text size="sm" weight="black">
          {nickname}
        </Text>
      </Grid>
      <Grid container="flex" justifyContent="end" flexGrow={0} gap={0.5}>
        <CommonButton size="sm" onClick={() => acceptFriendRequest(friendId)}>
          수락
        </CommonButton>
        <CommonButton size="sm" onClick={() => rejectFriendRequest(friendId)}>
          거절
        </CommonButton>
      </Grid>
    </Box>
  );
};

export const FriendsModal = ({ isOpen, onClose }: Omit<ModalProps, 'children'>) => {
  const { friendRequests, refetchFriendRequests } = useFriendRequest({ enabled: isOpen });
  const { requestFriend } = useFriendMutation();
  const { value: nickname, setValue: setNickname, onChange: handleNicknameChange } = useInput('');

  useEffect(() => {
    refetchFriendRequests();
  }, [isOpen]);

  const handleFriendRequest = () => {
    if (!nickname) alert('닉네임을 입력해주세요!');
    requestFriend(nickname);
    setNickname('');
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
            sizes="lg"
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
          {friendRequests.map((request) => (
            <FriendRequestItem key={request.id} friendId={request.id} friend={request.sender} />
          ))}
        </Grid>
      </Grid>
    </Modal>
  );
};
