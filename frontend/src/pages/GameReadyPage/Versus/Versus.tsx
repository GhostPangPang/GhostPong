import styled from 'styled-components';
import { Grid, Text, Dropbox, Ghost, GameButton } from '@/common';
import { ReactComponent as Crown } from '@/svgs/crown.svg';
import { MemberInfo } from '@/dto/channel/socket';
import { useAuth, useChannelMutation } from '@/hooks';
import { useRecoilValue } from 'recoil';
import { channelIdState, channelDataState } from '@/stores';
// import { newChannelDataState } from '@/stores';
import { Items, Item } from '@/libs/utils/itemgenerator';
// import { PlayerInfo } from '../mock-data';

interface VersusProps {
  items: Items;
}
interface GhostBoxProps {
  player: MemberInfo;
  item: Item[];
}

const NickNameText = styled(Text)`
  font-weight: bold;
  transition: background-color 0.3s, box-shadow 0.3s;
  color: ${({ theme }) => theme.color.foreground};
  cursor: pointer;
  &:hover {
    background-position: 0 0;
    transform: scale(1.1);
  }
`;

const GhostBox = ({ player, item }: GhostBoxProps) => {
  const { userInfo } = useAuth();

  return (
    <Grid container="flex" direction="column" alignItems="center" justifyContent="center">
      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" gap={1}>
        {player.role === 'owner' && <Crown />}
        {player.userId == userInfo.id ? (
          <NickNameText size="xxl">{player.nickname}</NickNameText>
        ) : (
          <Dropbox items={item} placement="bottomleft">
            <NickNameText size="xxl">{player.nickname}</NickNameText>
          </Dropbox>
        )}
      </Grid>
      <Grid gridColumn="2" alignSelf="center" justifySelf="center" size={{ height: '36rem', width: '36rem' }}>
        <Ghost />
      </Grid>
    </Grid>
  );
};

export const Versus = ({ items }: VersusProps) => {
  const channelId = useRecoilValue(channelIdState);
  const { leftPlayer, rightPlayer } = useRecoilValue(channelDataState);
  const { becomePlayer, becomeOwner } = useChannelMutation();

  const handleBecomePlayer = () => {
    becomePlayer(channelId);
  };

  const handleBecomeOwner = () => {
    becomeOwner(channelId);
  };

  return (
    <Grid container="flex" direction="row" alignItems="center" justifyContent="center">
      <Grid container="flex" direction="column" alignItems="center" justifyContent="center" flexGrow={1}>
        {leftPlayer ? (
          <GhostBox player={leftPlayer} item={items.leftPlayer} />
        ) : (
          <GameButton size="md" onClick={handleBecomeOwner}>
            방장되기
          </GameButton>
        )}
      </Grid>
      <Text size="xxl" weight="bold" fontFamily="game">
        VS
      </Text>
      <Grid container="flex" direction="column" alignItems="center" justifyContent="center" flexGrow={1}>
        {rightPlayer ? (
          <GhostBox player={rightPlayer} item={items.rightPlayer} />
        ) : (
          <GameButton size="md" onClick={handleBecomePlayer}>
            참여하기
          </GameButton>
        )}
      </Grid>
    </Grid>
  );
};
