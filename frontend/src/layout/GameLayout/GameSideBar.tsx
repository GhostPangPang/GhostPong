import { useState } from 'react';
import { Text, Box, Grid, Avatar, GameButton, Badge, Dropbox } from '@/common';
import { ReactComponent as SideBarIcon } from '@/assets/svgs/sidebar.svg';
// import { friendMockData } from '@/pages/GameReadyPage/mock-data';
import { UserInfo } from '@/dto/user';
import styled from 'styled-components';
import { useFriend } from '@/hooks/friend';
import { useNavigate } from 'react-router-dom';
import { useChannelMutation, useLeaveChannel } from '@/hooks/channel';
import { useRecoilValue } from 'recoil';
import { channelIdState } from '@/stores';

// const { friends } = friendMockData;
// friend hook으로 업데이트 해야함

const StyledSideBarButton = styled.button`
  position: fixed;
  right: 0;
  top: 50%;
  padding-right: 0rem;
  transform: translateY(-50%);
  z-index: 2;
  border: none;
  cursor: pointer;
`;

const StyledLine = styled.div`
  width: 90%;
  height: 1px;
  background-color: ${(props) => props.theme.color.gray100};
`;

const StyledFriendsList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  overflow: auto;
  width: 90%;
  max-height: 36rem;
  gap: 1.8rem;
`;

const FriendsListBox = styled(Box)<{ isOpen: boolean }>`
  position: fixed;
  right: ${({ isOpen }) => (isOpen ? 0 : '-30rem')};
  top: 50%;
  transform: translateY(-50%);
  transition: right 0.3s ease-out;
  width: 30rem;
  height: 42rem;
  z-index: 1;
  background-color: ${({ theme }) => theme.color.gray200};
`;

interface FriendsListItemProps {
  status: 'game' | 'online' | 'offline';
  player: UserInfo;
}

const FirendsListItem = ({ status, player }: FriendsListItemProps) => {
  const navigate = useNavigate();
  const { leaveChannel } = useLeaveChannel();
  const { inviteChannel } = useChannelMutation();
  const channelId = useRecoilValue(channelIdState);
  const dropboxItems = [
    {
      label: '프로필',
      onClick: () => {
        if (confirm('프로필 페이지로 이동하시겠습니까?')) {
          leaveChannel(channelId);
          navigate(`/profile/${player.id}`);
        }
      },
    },
  ];

  return (
    <Grid container="flex" direction="row" alignItems="center" justifyContent="space-around" gap={1}>
      <Badge status={status}>
        <Dropbox items={dropboxItems} desc={player.nickname} placement="bottomleft">
          <Avatar size="sm" src={player.image} />
        </Dropbox>
      </Badge>
      <Text size="xxxs" weight="bold">
        {status}
      </Text>
      <GameButton size="sm" onClick={() => inviteChannel({ channelId, userId: player.id })}>
        <Text size="xxxs" weight="bold">
          초대하기
        </Text>
      </GameButton>
    </Grid>
  );
};

const FriendsList = () => {
  const { friends } = useFriend();
  return (
    <Grid container="flex" direction="column" alignItems="center" justifyContent="center" gap={0.5}>
      <Text size="lg" weight="bold">
        친구 목록
      </Text>
      <StyledLine />
      <StyledFriendsList>
        {friends.map((friend) => (
          <FirendsListItem key={friend.id} status={friend.status} player={friend.user} />
        ))}
      </StyledFriendsList>
    </Grid>
  );
};

export const GameSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <StyledSideBarButton onClick={handleClick}>
        <SideBarIcon />
      </StyledSideBarButton>
      <FriendsListBox isOpen={isOpen}>
        <FriendsList />
      </FriendsListBox>
    </>
  );
};
